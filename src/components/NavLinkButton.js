import "../css/NavLinkButton.css";

function NavLinkButton({ onClickAction, specific, children }) {
    return (
        <span
            className={"titleBar-rightNav-navLink " + specific}
            onClick={onClickAction}
        >
            {children}
        </span>
    );
}

export default NavLinkButton;
