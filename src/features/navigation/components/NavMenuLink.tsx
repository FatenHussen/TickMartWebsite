import { Link, useLocation } from "react-router-dom";
import type { NavMenuItem } from "../types";
import {
    isNavPathActive,
    type NavMenuDestination,
    type NavMenuModal,
} from "../lib/resolveNavMenuItem";

type NavMenuLinkProps = {
    item: NavMenuItem;
    destination: NavMenuDestination;
    /** Surface-specific classes; receives the item's active state. */
    getClassName: (active: boolean) => string;
    /** Called after any activation — used to close the mobile drawer. */
    onNavigate?: () => void;
    /** Opens the destination's modal for `kind: "modal"` items. */
    onOpenModal?: (modal: NavMenuModal) => void;
};

/**
 * One dashboard-managed nav entry. Internal items go through react-router,
 * external ones through a plain anchor, and `subscriptions` through a button
 * because its destination is a modal rather than a route.
 */
export default function NavMenuLink({
    item,
    destination,
    getClassName,
    onNavigate,
    onOpenModal,
}: NavMenuLinkProps) {
    const location = useLocation();

    const active =
        destination.kind === "internal" &&
        isNavPathActive(location.pathname, destination.to);

    const className = getClassName(active);
    const newTab = item.open_in_new_tab === true;

    const content = (
        <>
            {item.icon ? (
                <img
                    src={item.icon}
                    alt=""
                    className="h-5 w-5 shrink-0 rounded object-contain"
                    loading="lazy"
                />
            ) : null}
            <span className="truncate">{item.title}</span>
        </>
    );

    if (destination.kind === "modal") {
        return (
            <button
                type="button"
                className={className}
                onClick={() => {
                    onNavigate?.();
                    onOpenModal?.(destination.modal);
                }}
            >
                {content}
            </button>
        );
    }

    if (destination.kind === "external") {
        return (
            <a
                href={destination.href}
                className={className}
                target={newTab ? "_blank" : undefined}
                rel="noopener noreferrer"
                onClick={() => onNavigate?.()}
            >
                {content}
            </a>
        );
    }

    return (
        <Link
            to={destination.to}
            className={className}
            aria-current={active ? "page" : undefined}
            // A `target` makes react-router hand the click to the browser, which
            // is what an internal item flagged `open_in_new_tab` should do.
            target={newTab ? "_blank" : undefined}
            rel={newTab ? "noopener" : undefined}
            onClick={() => onNavigate?.()}
        >
            {content}
        </Link>
    );
}
