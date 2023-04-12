import "../css/NavLinkButton.css";

function NavLinkButton({ onClickAction, id, children }) {
    return (
        <span
            className={"titleBar-rightNav-navLink"}
            id={id}
            onClick={onClickAction}
        >
            {children}
        </span>
    );
}

export default NavLinkButton;
