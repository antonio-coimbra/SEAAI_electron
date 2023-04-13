import "../css/StandardButton.css";

function StandardButton({ children, onClick }) {
    return (
        <button onClick={onClick} className="StandardButton">
            {children}
        </button>
    );
}

export default StandardButton;
