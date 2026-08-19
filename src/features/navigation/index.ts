export { default as NavMenuLink } from "./components/NavMenuLink";
export { useNavMenu } from "./hooks/useNavMenu";
export {
    resolveNavMenu,
    resolveNavMenuItem,
    isNavPathActive,
    type NavMenuDestination,
    type NavMenuModal,
    type ResolvedNavMenuItem,
} from "./lib/resolveNavMenuItem";
export type { NavMenuItem, NavMenuItemType, NavMenuTarget } from "./types";
