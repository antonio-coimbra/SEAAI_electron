import "../css/Title.css";

function Title({ subtitle }) {
    return (
        <div className="title">
            <div className="title-main">Connect to Sentry</div>
            <div className="title-subtitle">{subtitle}</div>
        </div>
    );
}

export default Title;
