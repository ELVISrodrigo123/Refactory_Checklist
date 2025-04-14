import type { MenuItemProps } from './types'
import { MobileSideNav } from "./MobileSideNab"
import { DesktopSideNav } from "./DesktopSideNav"
import React from 'react'
export { menuItems } from "./SideNavItemsData";

export function SideNav({ items, isMobile }: MenuItemProps) {
    if (isMobile) {
        return <MobileSideNav items={items} />
    }
    return (
        <DesktopSideNav items={items} />
    )
}


