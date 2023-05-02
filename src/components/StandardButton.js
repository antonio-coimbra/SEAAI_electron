import "../css/StandardButton.css";

function StandardButton({ children, onClick }) {
    return (
        <button onClick={onClick} className="standardButton">
            {children}
        </button>
    );
}

export default StandardButton;
