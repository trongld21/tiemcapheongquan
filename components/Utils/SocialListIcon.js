import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
    LinkedinShareButton,
    LinkedinIcon,
    TelegramShareButton,
    TelegramIcon,
} from 'next-share';
function SocialListIcon({ url, content }) {
    return (
        <div className="flex gap-2.5 justify-end">
            <FacebookShareButton url={url} quote={content} hashtag={'#TKDecor'}>
                <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton url={url} title={content}>
                <TwitterIcon size={32} round />
            </TwitterShareButton>
            <LinkedinShareButton url={url}>
                <LinkedinIcon size={32} round />
            </LinkedinShareButton>
            <TelegramShareButton url={url} title={content}>
                <TelegramIcon size={32} round />
            </TelegramShareButton>
        </div>
    );
}

export default SocialListIcon;
