export interface MenuItemProps {
    items: {
        path: string;
        label: string;
        icon: JSX.Element;
    }[];
    isMobile?: boolean;

}