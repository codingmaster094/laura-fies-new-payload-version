'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, {  useRef, useState } from 'react'
import type { Header } from '@/payload-types'
import { Logo } from '@/components/Logo/Logo'
import Lenis from '@studio-freight/lenis'
import Image from 'next/image'

/* small helper types for local use (optional — Header from payload-types is authoritative) */
type Media = {
  url?: string | null
  alt?: string | null
  width?: number | string | null
  height?: number | string | null
}

type LinkObj = {
  type?: string | null
  url?: string | null
  label?: string | null
  target?: '_self' | '_blank' | null
  newTab?: boolean | null
  appearance?: string | null
}

type LinkWrapper = {
  link?: LinkObj | null
  id?: string
}

type MenuItem = {
  link?: {
    label?: string | null
    url?: string | null
    target?: '_self' | '_blank' | null
  } | null
  submenus?: unknown[] | null
  id?: string | null
}

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const pathname = usePathname()
  const lenisRef = useRef<Lenis | null>(null)

  const handleSmoothScroll = (e: React.MouseEvent, targetId?: string) => {
    if (!targetId) return
    if (!targetId.startsWith('#')) return

    e.preventDefault()

    const el = document.querySelector(targetId)

    if (el && lenisRef.current) {
      if (el instanceof HTMLElement) {
        lenisRef.current.scrollTo(el, {
          offset: -80,
          duration: 1.2,
        })
      } else {
        lenisRef.current.scrollTo(targetId, {
          offset: -80,
          duration: 1.2,
        })
      }
    } else if (el) {
      if (el instanceof HTMLElement) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  // safe accessors / defaults
  const menus: MenuItem[] = (data?.menus as unknown as MenuItem[]) || []
  const topLinks: LinkWrapper[] = (data?.links as unknown as LinkWrapper[]) || []

  return (
    <>
      <header className="py-31 sticky top-0 bg-white z-[99]">
        <div className="container">
          <div className="flex justify-between items-center gap-50">
            <Link href="/">
              <Logo
                loading="eager"
                priority="high"
                className="dark:invert-0 w-100 xl:w-135"
                logosrc={(data?.Header_Logo as Media | undefined)?.url || ''}
              />
            </Link>

            <nav id="menu" className="xl:block hidden" role="navigation" aria-label="menü">
              <ul className="flex justify-center items-center gap-48 [&_li>a]:text-primary [&_li>a]:font-outfit [&_li>a]:text-base font-light">
                {menus.length > 0 &&
                  menus.map((menu, index) => {
                    const menuUrl = (menu?.link?.url ?? '/') as string
                    const isAnchor = typeof menuUrl === 'string' && menuUrl.startsWith('#')
                    const isActive =
                      pathname === menuUrl || (menuUrl !== '/' && pathname.startsWith(menuUrl))

                    return (
                      <li key={menu.id ?? index}>
                        {isAnchor ? (
                          <a
                            href={menuUrl}
                            onClick={(e) => handleSmoothScroll(e as React.MouseEvent, menuUrl)}
                            className={`${isActive ? 'active' : 'text-primary'} transition-all duration-200`}
                          >
                            {menu?.link?.label ?? ''}
                          </a>
                        ) : (
                          <Link
                            href={menuUrl}
                            aria-label={menu?.link?.label ?? ''}
                            aria-roledescription="link"
                            target={(menu?.link?.target as string) || '_self'}
                            className={`${isActive ? 'active' : 'text-primary'} transition-all duration-200`}
                          >
                            {menu?.link?.label ?? ''}
                          </Link>
                        )}
                      </li>
                    )
                  })}
              </ul>
            </nav>

            <div className="flex justify-end items-center gap-16 md:gap-24">
              {topLinks.map((linkItem, idx) => {
                const linkObj = linkItem?.link
                if (!linkObj?.url) return null
                const href = linkObj.url
                // prefer boolean newTab OR explicit target
                const openInNewTab = !!linkObj.newTab || linkObj.target === '_blank'
                const target = openInNewTab ? '_blank' : undefined
                const rel = openInNewTab ? 'noopener noreferrer' : undefined

                return (
                  <Link
                    key={linkItem.id ?? idx}
                    href={href}
                    onClick={(e) => handleSmoothScroll(e as React.MouseEvent, href)}
                    target={target}
                    rel={rel}
                    aria-label={`${linkObj.label ?? ''} – Startseite`}
                    className="btn-dark !hidden sm:!block"
                  >
                    <span>{linkObj.label ?? ''}</span>
                  </Link>
                )
              })}

              {topLinks.map((linkItem, idx) => {
                const linkObj = linkItem?.link
                if (!linkObj?.url) return null
                const href = linkObj.url
                const openInNewTab = !!linkObj.newTab || linkObj.target === '_blank'
                const target = openInNewTab ? '_blank' : undefined
                const rel = openInNewTab ? 'noopener noreferrer' : undefined

                return (
                  <Link
                    key={`mobile-${linkItem.id ?? idx}`}
                    href={href}
                    target={target}
                    rel={rel}
                    aria-label="Kontaktieren Sie uns – Startseite"
                    className="bg-black p-4 rounded-sm !block sm:!hidden"
                  >
                    <Image
                      src="/images/phone.svg"
                      alt="phone icon"
                      role="img"
                      width={50}
                      height={50}
                      className="w-30 h-30 block sm:hidden"
                    />
                  </Link>
                )
              })}

              <button
                id="menu-btn"
                className="xl:hidden block cursor-pointer"
                aria-label="Toggle menu"
              >
                <Image
                  src="/images/menu-btn.svg"
                  alt="Menu button"
                  role="img"
                  width={50}
                  height={50}
                  className="w-40 h-40"
                />
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
