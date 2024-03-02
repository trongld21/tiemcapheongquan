import moment from 'moment';
import Link from 'next/link';
import * as Yup from 'yup';

export const itemsNews = [
    {
        key: '1',
        label: (
            <Link href="/news">
                <p className="font-bold">ALL</p>
            </Link>
        ),
    },
    {
        key: '2',
        label: (
            <Link href="">
                <p className="font-bold">HOT NEWS</p>
            </Link>
        ),
    },
    {
        key: '3',
        label: (
            <Link href="">
                <p className="font-bold">ART</p>
            </Link>
        ),
    },
    {
        key: '4',
        label: (
            <Link href="">
                <p className="font-bold">TRENDS</p>
            </Link>
        ),
    },
    {
        key: '5',
        label: (
            <Link href="">
                <p className="font-bold">LIFESTYLES</p>
            </Link>
        ),
    },
];
export const itemsProducts = [
    {
        key: '1',
        label: (
            <Link href="/news">
                <p className="font-bold">SHOP ALL</p>
            </Link>
        ),
    },
    {
        key: '2',
        label: (
            <Link href="">
                <p className="font-bold">NEW ARRIVALS</p>
            </Link>
        ),
    },
    {
        key: '3',
        label: (
            <Link href="">
                <p className="font-bold">CHAIRS</p>
            </Link>
        ),
    },
    {
        key: '4',
        label: (
            <Link href="">
                <p className="font-bold">TABLES</p>
            </Link>
        ),
    },
    {
        key: '5',
        label: (
            <Link href="">
                <p className="font-bold">SOFAS</p>
            </Link>
        ),
    },
];

export const itemsProfile = (method) => {
    return [
        {
            key: '1',
            label: (
                <Link href="/user/info">
                    <p className="font-bold">HỒ SƠ</p>
                </Link>
            ),
        },
        {
            key: '2',
            label: (
                <Link href="/user/address">
                    <p className="font-bold">ĐỊA CHỈ</p>
                </Link>
            ),
        },
        {
            key: '3',
            label: (
                <Link href="/user/favorite">
                    <p className="font-bold">SẢN PHẨM YÊU THÍCH</p>
                </Link>
            ),
        },
        {
            key: '4',
            label: (
                <Link href="/user/orders">
                    <p className="font-bold">ĐƠN HÀNG</p>
                </Link>
            ),
        },
        {
            key: '5',
            label: (
                <button onClick={() => method()} className="w-full text-left">
                    <p className="font-bold">ĐĂNG XUẤT</p>
                </button>
            ),
        },
    ];
};

export const moduleProductCreate = {
    toolbar: [
        [{ header: '1' }, { header: '2' }, { font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['link'],
        ['clean'],
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    },
};

export const modulesArticleCreate = {
    toolbar: [
        [{ header: '1' }, { header: '2' }, { font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['link', 'image', 'video'],
        ['clean'],
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    },
};

export const formatArticleCreate = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
];

export const validationAddressForm = Yup.object().shape({
    name: Yup.string()
        .required('Vui lòng nhập họ và tên')
        .min(5, 'Họ và tên ít nhất 5 kí tự')
        .max(100, 'Họ và tên nhiều nhất 100 kí tự')
        .matches(/^[a-zA-ZÀ-ỹ ]+$/, 'Họ và tên chỉ chứa ký tự hoa, thường và khoảng trắng'),
    phone: Yup.string()
        .required('Vui lòng nhập số điện thoại')
        .min(10, 'Số điện thoại phải là 10 số')
        .max(10, 'Số điện thoại phải là 10 số')
        .matches(/^(0\d{9,10})$/, 'Số điện thoại không hợp lệ'),
    street: Yup.string().required('Vui lòng nhập địa chỉ cụ thể').max(100, 'Địa chỉ cụ thể nhiều nhất 100 kí tự'),
});

// Item step of status order
export const itemSteps = [
    {
        title: 'Đã đặt hàng',
        // description: 'Đơn hàng đã được đặt.',
    },
    {
        title: 'Đang xử lý',
        // description: 'Đơn hàng đang trong quá trình xử lý.',
    },
    {
        title: 'Đang giao hàng',
        // description: 'Đơn hàng đang được vận chuyển.',
    },
    {
        title: 'Đã nhận hàng',
        // description: 'Đơn hàng đã được giao thành công và hoàn tất quá trình.',
    },
];
// Item step of status order
export const itemStepsCancel = [
    {
        title: 'Đã đặt hàng',
        // description: 'Đơn hàng đã được đặt.',
    },
    {
        title: 'Đang xử lý',
        // description: 'Đơn hàng đang trong quá trình xử lý.',
    },
    {
        title: 'Hủy đơn hàng',
        // description: 'Đơn hàng đang được vận chuyển.',
    },
    {
        title: 'Đã nhận hàng',
        // description: 'Đơn hàng đã được giao thành công và hoàn tất quá trình.',
    },
];

// sort option review
export const sortOptionReview = [
    { value: 'default', label: 'Đánh giá mới nhất' },
    // { value: 'rate-most-like', label: 'Được thích nhiều nhất' },
    {
        value: 'rate-high-to-low',
        label: 'Từ cao đến thấp',
    },
    {
        value: 'rate-low-to-high',
        label: 'Từ thấp đến cao',
    },
];

export const InteractionStatus = {
    Like: 'Like',
    Normal: 'Normal',
    Dislike: 'Dislike',
};

export const validationReportReview = Yup.object().shape({
    reason: Yup.string()
        .trim()
        .required('Lý do không được bỏ trống')
        .min(5, 'Lý do ít nhất 5 ký tự')
        .max(255, 'Lý do nhiều nhất 255 ký tự'),
});

export const validationRegisterForm = Yup.object().shape({
    email: Yup.string()
        .trim()
        .max(100, 'Địa chỉ email nhiều nhất 100 ký tự')
        .required('Vui lòng nhập địa chỉ email')
        .email('Định dạng email không đúng'),
    name: Yup.string()
        .trim()
        .required('Vui lòng nhập họ và tên')
        .min(5, 'Họ và tên ít nhất 5 ký tự')
        .max(100, 'Họ và tên nhiều nhất 100 ký tự')
        .matches(/^[a-zA-ZÀ-ỹ ]+$/, 'Họ và tên chỉ chứa ký tự hoa, thường và khoảng trắng'),
    // dob: Yup.date().required('Vui lòng chọn ngày tháng năm sinh'),
    // phone: Yup.string()
    //     .required('Vui lòng nhập số điện thoại')
    //     .matches(/^(0\d{9,10})$/, 'Số điện thoại không hợp lệ')
    //     .min(10, 'Số điện thoại không hợp lệ')
    //     .max(10, 'Số điện thoại không hợp lệ'),
    password: Yup.string()
        .trim()
        .required('Vui lòng nhập mật khẩu')
        .min(7, 'Mật khẩu ít nhất 7 ký tự')
        .max(20, 'Mật khẩu nhiều nhất 20 ký tự'),
    passwordConfirmation: Yup.string()
        .trim()
        .required('Vui lòng nhập lại mật khẩu')
        // .min(7, 'Mật khẩu ít nhất 7 ký tự')
        // .max(20, 'Mật khẩu nhiều nhất 20 ký tự')
        .oneOf([Yup.ref('password'), null], 'Mật khẩu không trùng khớp'),
});

export const validationCode = Yup.object().shape({
    code: Yup.string()
        .required('Vui lòng nhập mã xác nhận')
        .typeError('Mã xác nhận bao gồm 7 ký tự')
        .min(7, 'Mã xác nhận bao gồm 7 ký tự')
        .max(7, 'Mã xác nhận bao gồm 7 ký tự'),
});

export const validationChangePassword = Yup.object().shape({
    oldPassword: Yup.string()
        .trim()
        .required('Vui lòng nhập mật khẩu cũ')
        .min(7, 'Mật khẩu ít nhất 7 ký tự')
        .max(20, 'Mật khẩu nhiều nhất 20 ký tự'),
    newPassword: Yup.string()
        .trim()
        .required('Vui lòng nhập mật khẩu mới')
        .min(7, 'Mật khẩu mới ít nhất 7 ký tự')
        .max(20, 'Mật khẩu mới nhiều nhất 20 ký tự'),
    passwordConfirmation: Yup.string()
        .trim()
        .required('Vui lòng nhập lại mật khẩu mới')
        // .min(7, 'Mật khẩu mới ít nhất 7 ký tự')
        // .max(20, 'Mật khẩu mới nhiều nhất 20 ký tự')
        .oneOf([Yup.ref('newPassword'), null], 'Mật khẩu mới không trùng khớp'),
    code: Yup.string()
        .required('Vui lòng nhập mã xác nhận')
        .typeError('Mã xác nhận bao gồm 7 ký tự')
        .min(7, 'Mã xác nhận bao gồm 7 ký tự')
        .max(7, 'Mã xác nhận bao gồm 7 ký tự'),
});

export const validationUserInfo = Yup.object({
    fullName: Yup.string()
        .required('Vui lòng nhập họ và tên')
        .min(5, 'Họ và tên ít nhất 5 kí tự')
        .max(100, 'Họ và tên nhiều nhất 100 kí tự')
        .matches(/^[a-zA-ZÀ-ỹ ]+$/, 'Họ và tên chỉ chứa ký tự hoa, thường và khoảng trắng'),
    birthDay: Yup.date()
        .required('Vui lòng nhập ngày tháng năm sinh')
        .test('is-over-12-years', 'Bạn phải đủ 16 tuổi trở lên', (value) => {
            const birthday = moment(value);
            const twelveYearsAgo = moment().subtract(16, 'years');
            return birthday.isSameOrBefore(twelveYearsAgo);
        })
        .test('is-under-120-years', 'Vui lòng nhập tuổi thật của bạn', (value) => {
            const birthday = moment(value);
            const oneHundredTwentyYearsAgo = moment().subtract(120, 'years');

            return birthday.isSameOrAfter(oneHundredTwentyYearsAgo);
        }),
    // .max(new Date(new Date().setFullYear(new Date().getFullYear() - 12)), 'Người dùng phải lớn hơn 12 tuổi'),
    email: Yup.string()
        .trim()
        .required('Vui lòng nhập địa chỉ email')
        .email('Định dạng email không đúng')
        .max(100, 'Địa chỉ email nhiều nhất 100 ký tự'),
    phone: Yup.string()
        .required('Số điện thoại không được bỏ trống')
        .min(10, 'Số điện thoại không hợp lệ')
        .max(10, 'Số điện thoại không hợp lệ')
        .matches(/^(0\d{9,10})$/, 'Số điện thoại không hợp lệ'),
    gender: Yup.string().required('Giới tính không được bỏ trống'),
});

export const optionGender = [
    {
        value: 'Other',
        label: 'Khác',
    },
    {
        value: 'Male',
        label: 'Nam',
    },
    {
        value: 'Female',
        label: 'Nữ',
    },
];

export const sortOptionProduct = [
    { value: 'default', label: 'Sản phẩm mới nhất' },
    // { value: 'rate-most-like', label: 'Được thích nhiều nhất' },
    {
        value: 'price-high-to-low',
        label: 'Giá giảm dần',
    },
    {
        value: 'price-low-to-high',
        label: 'Giá tăng dần',
    },
    {
        value: 'average-rate',
        label: 'Được đánh giá cao',
    },
];

export const sortArticleOptions = [
    { value: 'default', label: 'Mới nhất' },
    { value: 'date-old', label: 'Cũ nhất' },
];

export const validationEmail = Yup.object().shape({
    email: Yup.string()
        .trim()
        .max(100, 'Địa chỉ email nhiều nhất 100 ký tự')
        .required('Vui lòng nhập địa chỉ email')
        .email('Định dạng email không đúng'),
});

export const validationForgot = Yup.object().shape({
    password: Yup.string()
        .trim()
        .required('Vui lòng nhập mật khẩu mới')
        .min(7, 'Mật khẩu mới ít nhất 7 ký tự')
        .max(20, 'Mật khẩu mới nhiều nhất 20 ký tự'),
    passwordConfirmation: Yup.string()
        .trim()
        .required('Vui lòng nhập lại mật khẩu mới')
        // .min(7, 'Mật khẩu mới ít nhất 7 ký tự')
        // .max(20, 'Mật khẩu mới nhiều nhất 20 ký tự')
        .oneOf([Yup.ref('password'), null], 'Mật khẩu mới không trùng khớp'),
    code: Yup.string()
        .required('Vui lòng nhập mã xác nhận')
        .typeError('Mã xác nhận bao gồm 7 ký tự')
        .min(7, 'Mã xác nhận bao gồm 7 ký tự')
        .max(7, 'Mã xác nhận bao gồm 7 ký tự'),
});

export const validationUploadModel = Yup.object().shape({
    name: Yup.string()
        .trim()
        .required('Vui lòng nhập tên Model')
        .min(2, 'Tên Model phải có ít nhất 2 ký tự')
        .max(100, 'Tên Model không được vượt quá 100 ký tự'),
    image: Yup.string().trim().required('Vui lòng tải ảnh lên cho mô hình'),
    model: Yup.string().trim().required('Vui lòng tải lên mô hình 3D'),
});

export const validationCategory = Yup.object().shape({
    name: Yup.string()
        .trim()
        .required('Vui lòng nhập tên danh mục')
        .min(2, 'Danh mục có ít nhất 2 ký tự')
        .max(100, 'Danh mục nhiều nhất 100 ký tự'),
    image: Yup.string().trim().required('Vui lòng chọn ảnh cho danh mục'),
});

export const validateProduct = Yup.object({
    name: Yup.string()
        .trim()
        .required('Vui lòng nhập tên sản phẩm')
        .min(2, 'Tên sản phẩm ít nhất 2 kí tự')
        .max(100, 'Tên sản phẩm nhiều nhất 100 kí tự'),
    category: Yup.string().trim().required('Vui lòng chọn danh mục'),
    quantity: Yup.number()
        .typeError('Số lượng phải là chữ số')
        .min(0, 'Số lượng ít nhất là 0')
        .max(1000000, 'Số lượng nhiều nhất là 1,000,000 sản phẩm')
        .required('Vui lòng nhập số lượng sản phẩm'),
    price: Yup.number()
        .typeError('Giá sản phẩm phải là chữ số')
        .positive('Giá sản phẩm ít nhất là 1 VND')
        .max(9999999999, 'Giá sản phẩm nhiều nhất 9,999,999,999 VND')
        .required('Vui lòng nhập giá sản phẩm'),
    description: Yup.string().trim().required('Vui lòng nhập mô tả'),
    image: Yup.array().min(1, 'Tải lên ít nhất 1 hình ảnh cho sản phẩm'),
});
