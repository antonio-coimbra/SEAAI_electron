import "../css/StandardButton.css";

function StandardButton({ children, onClick, icon }) {
    return (
        <button onClick={onClick} className="standardButton">
            <img src={icon} alt="" className="standardButton-icon"></img>
            {children}
        </button>
    );
}

export default StandardButton;
