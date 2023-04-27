import "../css/MacNavLinkButton.css";

function MacNavLinkButton({ onClickAction, specific, children }) {
    return (
        <button
            className={"macNavLinkButton macNavLinkButton-" + specific}
            onClick={onClickAction}
        ></button>
    );
}

export default MacNavLinkButton;
