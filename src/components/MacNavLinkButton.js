import "../css/MacNavLinkButton.css";

function MacNavLinkButton({ onClickAction, specific }) {
    return (
        <button
            className={"macNavLinkButton macNavLinkButton-" + specific}
            onClick={onClickAction}
        ></button>
    );
}

export default MacNavLinkButton;
