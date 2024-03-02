import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// Component
import BackButton from './BackButton';
import PrimaryButton from './PrimaryButton';
// Ant design component
import { InboxOutlined } from '@ant-design/icons';
import { Progress, Spin, Upload, message } from 'antd';
const { Dragger } = Upload;
// Axios component
import apiLuma from '@/pages/api/apiLuma';
import managerModelAPI from '@/pages/api/manager/managerModelAPI';
// hook notification
import useNotification from '@/hooks/useNotification';
// Component form validate
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
// Ant design component
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
const { confirm } = Modal;

const VideoPreview = () => {
    const router = useRouter();
    const { showError, showSuccess } = useNotification();
    const [videoUpload, setVideoUpload] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [modelRender, setModelRender] = useState(null);
    const [loadingVideo, setLoadingVideo] = useState(false);
    const [videoFile, setVideoFile] = useState();
    const [progressUpload, setProgressUpload] = useState(0);
    const [slug, setSlug] = useState();
    const [uploading, setUploading] = useState(false);
    const [disable, setDisable] = useState(false);
    const [thumbnails, setThumbnails] = useState();
    const [uploaded, setUploaded] = useState(false);

    const props = {
        name: 'file',
        accept: 'video/*',
        maxCount: 1,
        progress: {
            type: 'line',
            showInfo: true,
        },
        onRemove: clearFiles,
        multiple: false,
        // Check video file
        beforeUpload: (file) => {
            const iVideo = file.type === 'video/mp4';
            if (!iVideo) {
                message.error(`${file.name} không phải là một tập tin video`);
            }
            return iVideo || Upload.LIST_IGNORE;
        },
        onChange(info) {
            let reader = new FileReader();
            const { status } = info.file;
            // Get origin file
            const selectedFile = info.file.originFileObj;
            // Remove current video
            setVideoUpload(null);
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            } else {
                setLoadingVideo(true);
            }
            // Check file is Blob type
            if (status === 'done' && selectedFile instanceof Blob) {
                message.success(`${info.file.name} tải video thành công.`);
                // read the file object
                reader.readAsDataURL(info.file.originFileObj);
            } else if (status === 'error') {
                message.error(`${info.file.name} tải video thất bại.`);
            }

            reader.onload = (readerEvent) => {
                // Set video to state
                if (selectedFile.type.includes('video')) {
                    setVideoUpload(readerEvent.target.result);
                    // setVideoFile(selectedFile);
                    setVideoFile(selectedFile);
                } else {
                    message.error('Không lưu được video');
                }
            };
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    function clearFiles() {
        setLoadingVideo(false);
        setVideoUpload(null);
    }

    function handleVideoLoad() {
        setLoadingVideo(false);
    }

    const handleBuildModel = async () => {
        setUploading(true);
        // Call Create Capture API
        const resCreateCapture = await apiLuma.CreateCapture();
        // Check luma key is valid
        if (resCreateCapture && resCreateCapture.error === 500) {
            showError('Tạo Capture thất bại', resCreateCapture.reason, 4);
            setUploading(false);
        } else if (resCreateCapture && resCreateCapture?.capture) {
            // Get slug to upload image
            setSlug(resCreateCapture?.capture?.slug);
            // convert image to array buffer
            const arrayBuf = await fetch(URL.createObjectURL(videoFile)).then((res) => res.arrayBuffer());
            // Upload capture
            const resUploadCapture = await apiLuma.UploadCapture(arrayBuf, resCreateCapture?.signedUrls?.source);
            // Check trigger upload capture
            if (resUploadCapture) {
                const resTrigger = await apiLuma.TriggerCapture(resCreateCapture?.capture?.slug);
                console.log('🚀 ~ file: VideoPreview.js:120 ~ handleBuildModel ~ resTrigger:', resTrigger);
                // Catch not have enough credits
                if (resTrigger && resTrigger.response?.status === 401) {
                    showError('Kích hoạt Capture thất bại', resTrigger?.response?.data?.reason, 4);
                    setSlug(null);
                    setUploading(false);
                    setDisable(false);
                    setUploaded(false);
                } else {
                    setUploaded(true);
                    localStorage.setItem('model-slug', resCreateCapture?.capture?.slug);
                    await apiLuma.UpdateCapture(resCreateCapture?.capture?.slug);
                }
            }
        }
    };

    const startUpload = () => {
        const intervalId = setInterval(() => {
            apiLuma.CheckStatus(slug).then((response) => {
                setProgressUpload(response.latestRun?.progress);
                if (response.latestRun?.progress === 100 || response.latestRun?.status === 'finished') {
                    setThumbnails(response.latestRun.artifacts.filter((item) => item.type === 'thumb').pop());
                    setVideoPreview(
                        response.latestRun.artifacts.filter((item) => item.type === 'video_with_background').pop(),
                    );
                    setModelRender(
                        response.latestRun.artifacts.filter((item) => item.type === 'textured_mesh_glb').pop(),
                    );
                    clearInterval(intervalId);
                }
                if (response.latestRun?.progress > 90 && response.latestRun?.status !== 'finished') {
                    setVideoPreview(
                        response.latestRun.artifacts.filter((item) => item.type === 'video_with_background').pop(),
                    );
                    setModelRender(
                        response.latestRun.artifacts.filter((item) => item.type === 'textured_mesh_glb').pop(),
                    );
                }
            });
        }, 5000);
    };

    useEffect(() => {
        if (uploaded && slug) {
            startUpload();
        }
    }, [uploaded, slug]);

    useEffect(() => {
        const currentCapture = localStorage.getItem('model-slug');
        if (currentCapture) {
            setUploaded(true);
            setSlug(currentCapture);
            setUploading(true);
            setDisable(true);
        }
    }, []);

    const validate = Yup.object({
        name: Yup.string()
            .required('Nhập tên Model')
            .min(2, 'Tên model ít nhất 2 kí tự')
            .max(100, 'Tên model nhiều nhất 100 kí tự'),
    });

    const showConfirm = (id) => {
        confirm({
            title: 'Bạn có hủy tải lên không',
            icon: <ExclamationCircleFilled />,
            content: '....',
            okType: 'danger',
            okText: 'Xác nhận',
            cancelText: 'Quay lại',
            async onOk() {
                // callback function to clear all state
                setUploading(false);
                setVideoUpload(null);
                setVideoPreview(null);
                setSlug(null);
                setLoadingVideo(false);
                setVideoFile(null);
                setDisable(false);
                setProgressUpload(0);
                localStorage.removeItem('model-slug');
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    return (
        <div className="my-10">
            <div className="flex justify-between">
                <BackButton title={'Quay lại'} />
                <PrimaryButton
                    active={uploading}
                    content={'Hủy bỏ'}
                    classCss={`bg-error text-white px-3 text-sm `}
                    onClick={() => showConfirm()}
                />
            </div>

            <div className="w-8/12 mx-auto my-10 justify-center flex flex-col gap-10">
                <h1 className="font-semibold text-lg -mb-8">Tải Video lên</h1>
                <Dragger {...props} className="w-fit mx-auto" disabled={disable}>
                    <div className={`${videoUpload || loadingVideo ? 'hidden' : 'block p-4'}`}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
                        <p className="ant-upload-hint">
                            Hỗ trợ tải lên một lần hoặc hàng loạt. Nghiêm cấm tải lên dữ liệu của công ty hoặc các tệp
                            bị cấm khác.
                        </p>
                    </div>
                    {loadingVideo && <Spin spinning className="py-20 px-80" />}
                    {videoUpload && (
                        <video
                            controls
                            muted
                            autoPlay
                            className={`h-90 w-90 ${loadingVideo ? 'hidden' : 'flex'}`}
                            preload="none"
                            onLoadedData={handleVideoLoad}
                        >
                            <source type="video/webm" src={videoUpload} />
                        </video>
                    )}
                </Dragger>

                <PrimaryButton
                    active={videoUpload}
                    content={'Xây dựng Model 3D'}
                    classCss={`border bg-secondary w-fit mx-auto text-white px-2 py-2 ${uploading && 'hidden'}`}
                    onClick={handleBuildModel}
                />

                <Progress
                    className={`${(!uploading || progressUpload === 100) && 'hidden'}`}
                    percent={progressUpload}
                    strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#87d068',
                    }}
                />
                {videoPreview && (
                    <div className="flex flex-col gap-2">
                        <h1 className="font-semibold text-lg">Xem trước Model</h1>
                        <video
                            controls
                            muted
                            autoPlay
                            className={`h-90 w-90 ${videoPreview ? 'flex' : 'hidden'}`}
                            preload="none"
                        >
                            <source type="video/webm" src={videoPreview.url} />
                        </video>
                    </div>
                )}

                {progressUpload > 98 && (
                    <Formik
                        initialValues={{ name: '' }}
                        validationSchema={validate}
                        onSubmit={async (values) => {
                            const res = await managerModelAPI.CreateModel(
                                values.name,
                                videoPreview.url,
                                modelRender.url,
                                thumbnails.url,
                            );
                            if (res && res.success) {
                                showSuccess('Tạo thành công', 'Chuyển hướng đến danh sách Model', 3);
                                localStorage.removeItem('model-slug');
                                router.push('/admin/models');
                            }
                        }}
                    >
                        <Form>
                            <div className="w-full">
                                <div className="flex flex-col items-center justify-center gap-1 p-4">
                                    <Field
                                        className="p-2 bot border-b border-t-0 border-l-0 border-r-0 border-black leading-tight focus:outline-none w-3/4"
                                        type="text"
                                        name="name"
                                        placeholder="Nhập tên Model ..."
                                    />
                                    <ErrorMessage name="name" component="p" className="text-error text-left text-xs" />
                                    <button
                                        className={`text-sm font-bold border border-black w-32 h-9 mt-10 ${
                                            !modelRender && 'hidden'
                                        }`}
                                        type="submit"
                                    >
                                        Tạo Model
                                    </button>
                                </div>
                            </div>
                        </Form>
                    </Formik>
                )}
            </div>
        </div>
    );
};

export default VideoPreview;
