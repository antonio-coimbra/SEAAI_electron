import "../css/Title.css";
import logo from "../images/favicon.png";
function Title({ children }) {
    return (
        <div className="title">
            <img src={logo} alt="logo" className="title-logo" />
            <div className="title-text">{children}</div>
        </div>
    );
}

export default Title;
