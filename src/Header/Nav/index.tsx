'use client'

import React from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { SearchIcon } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.menus || []

  return (
    <>
      <nav id="menu" className="xl:block hidden" role="navigation" aria-label="menü">
        <ul className="flex justify-center items-center gap-48 [&_li>a]:text-primary [&_li>a]:font-outfit [&_li>a]:text-base font-light">
          {navItems.map(({ link }, i) => {
            return <CMSLink key={i} {...link} appearance="link" />
          })}
          {/* {MenusData.menus.map((menu, index) => {
                  const menuUrl = menu.link?.url || "/";
                  const isAnchor = menuUrl.startsWith("#"); // detect section links
                  const isActive =
                    pathname === menuUrl ||
                    (menuUrl !== "/" && pathname.startsWith(menuUrl));

                  return (
                    <li key={index}>
                      {isAnchor ? (
                        <a
                          href={menuUrl}
                          onClick={(e) => handleSmoothScroll(e, menuUrl)}
                          className={`${
                            isActive ? "active" : "text-primary"
                          } transition-all duration-200`}
                        >
                          {menu.link?.label}
                        </a>
                      ) : (
                        <Link
                          href={menuUrl}
                          aria-label={menu.link?.label || ""}
                          aria-roledescription="link"
                          target={menu.link?.target || "_self"}
                          className={`${
                            isActive ? "active" : "text-primary"
                          } transition-all duration-200`}
                        >
                          {menu.link?.label}
                        </Link>
                      )}
                    </li>
                  );
                })} */}
        </ul>
        <SearchIcon className="w-5 text-primary" />
      </nav>
    </>
  )
}
