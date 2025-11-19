'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import type { Header } from '@/payload-types'
import { Logo } from '@/components/Logo/Logo'
import Lenis from '@studio-freight/lenis'
import Image from 'next/image'
import OffCanvas from '../components/OffCanvas'

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
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  // IMPORTANT: explicitly type the ref so TS knows it's a Lenis instance (or null)
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // create Lenis instance (omit unsupported option 'smoothTouch')
    const scroller = new Lenis({
      duration: 1.2, // speed of scroll
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      // removed smoothTouch because the installed Lenis type doesn't include it
    })

    // RAF loop: typed time and store id so we can cancel on cleanup
    let rafId = 0
    const loop = (time: number) => {
      scroller.raf(time)
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)

    lenisRef.current = scroller

    return () => {
      cancelAnimationFrame(rafId)
      scroller.destroy()
      lenisRef.current = null
    }
  }, [])

  // typed event and targetId
  const handleSmoothScroll = (e: React.MouseEvent, targetId: string) => {
    if (!targetId.startsWith('#')) {
      // Non-anchor — allow normal navigation
      return
    }

    e.preventDefault()
    const targetEl = document.querySelector(targetId)

    if (!lenisRef.current) {
      // fallback: no Lenis instance — scroll normally
      if (targetEl instanceof HTMLElement) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      setIsOpen(false)
      return
    }

    // If querySelector finds an HTMLElement, pass it. Otherwise pass the selector string.
    if (targetEl instanceof HTMLElement) {
      lenisRef.current.scrollTo(targetEl, {
        offset: -80,
        duration: 1.2,
      })
    } else {
      // Lenis accepts selector string too — safe fallback
      lenisRef.current.scrollTo(targetId, {
        offset: -80,
        duration: 1.2,
      })
    }

    setIsOpen(false)
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
                            onClick={(e) => handleSmoothScroll(e, menuUrl)}
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
                onClick={() => setIsOpen((v) => !v)}
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

      <OffCanvas
        logo={data?.Header_Logo}
        menus={menus}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
