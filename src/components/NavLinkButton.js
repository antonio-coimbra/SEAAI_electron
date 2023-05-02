import "../css/NavLinkButton.css";

function NavLinkButton({ onClickAction, specific, children }) {
    return (
        <span
            className={"navLinkButton navLinkButton-" + specific}
            onClick={onClickAction}
        >
            {children}
        </span>
    );
}

export default NavLinkButton;
