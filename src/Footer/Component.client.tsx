'use client'
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Lenis from '@studio-freight/lenis'
import type { Footer as FooterType } from '@/payload-types'

/**
 * Local helper types (derived from generated FooterType)
 */
type Footer = FooterType
type KontaktItem = NonNullable<Footer['kontakt']>[number]
type SocialItem = NonNullable<Footer['social']>[number]
type MenuItem = NonNullable<Footer['menus']>[number]
type SprechzeitItem = NonNullable<Footer['sprechzeiten']>[number]
type LegalItem = NonNullable<Footer['legalLinks']>[number]

/**
 * Generic "media-like" and "link-like" helpers.
 * We avoid `any` and use `unknown` casts and type narrowing instead.
 */
type MediaLike =
  | {
      url?: string | null
      alt?: string | null
      width?: number | string | null
      height?: number | string | null
    }
  | string
  | null
  | undefined

type LinkLike =
  | {
      type?: string | null
      url?: string | null
      label?: string | null
      target?: string | null
      newTab?: boolean | null
    }
  | null
  | undefined

const getMediaUrl = (m: MediaLike): string | undefined => {
  if (!m) return undefined
  return typeof m === 'string' ? m : (m.url ?? undefined)
}

const getMediaAlt = (m: MediaLike): string | undefined => {
  if (!m) return undefined
  return typeof m === 'string' ? undefined : (m.alt ?? undefined)
}

const getMediaWidth = (m: MediaLike): number | undefined => {
  if (!m) return undefined
  if (typeof m === 'string') return undefined
  if (typeof m.width === 'number') return m.width
  if (typeof m.width === 'string' && m.width !== '') return Number(m.width)
  return undefined
}

const getMediaHeight = (m: MediaLike): number | undefined => {
  if (!m) return undefined
  if (typeof m === 'string') return undefined
  if (typeof m.height === 'number') return m.height
  if (typeof m.height === 'string' && m.height !== '') return Number(m.height)
  return undefined
}

/**
 * Normalize different "link wrapper" shapes without using `any`.
 * Payload sometimes wraps link in { links: [{ link: { ... } }] } or { link: { ... } }.
 */
const getFirstLink = (wrapper: unknown): LinkLike => {
  if (!wrapper) return undefined
  // try shape { links: [{ link }] }
  const asWithLinks = wrapper as { links?: unknown[] }
  if (Array.isArray(asWithLinks.links) && asWithLinks.links.length) {
    const first = asWithLinks.links[0] as { link?: LinkLike }
    return first.link ?? undefined
  }
  // try shape { link: { ... } }
  const asWithLink = wrapper as { link?: LinkLike }
  if (asWithLink.link) return asWithLink.link
  return undefined
}

/**
 * Component
 */
export function FooterClient({ data }: { data: Footer }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const scroller = new Lenis({
      duration: 1.2,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    })

    function raf(time: number) {
      scroller.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
    lenisRef.current = scroller

    return () => {
      scroller.destroy()
    }
  }, [])

  const handleSmoothScroll = (e: React.MouseEvent, targetId?: string) => {
    if (!targetId) return
    // only smooth-scroll anchors (starting with '#')
    if (!targetId.startsWith('#')) return
    e.preventDefault()

    const el = document.querySelector(targetId)
    if (!el) return

    if (lenisRef.current) {
      if (el instanceof HTMLElement) {
        lenisRef.current.scrollTo(el, { offset: -80, duration: 1.2 })
      } else {
        lenisRef.current.scrollTo(targetId, { offset: -80, duration: 1.2 })
      }
    } else {
      if (el instanceof HTMLElement) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // typed arrays with safe fallbacks (no `any`)
  const kontaktArr: KontaktItem[] = (data?.kontakt ?? []) as KontaktItem[]
  const socialArr: SocialItem[] = (data?.social ?? []) as SocialItem[]
  const menusArr: MenuItem[] = (data?.menus ?? []) as MenuItem[]
  const sprechzeitenArr: SprechzeitItem[] = (data?.sprechzeiten ?? []) as SprechzeitItem[]
  const legalArr: LegalItem[] = (data?.legalLinks ?? []) as LegalItem[]

  return (
    <footer>
      <div className="footer-top pt-50 md:pt-80 pb-50 md:pb-100 bg-primary_1 text-white">
        <div className="container">
          <div className="inner flex justify-start xlg:justify-between items-start gap-20 xl:gap-40 flex-wrap xlg:flex-nowrap">
            {/* Kontakt column */}
            <div className="foot-col1 flex flex-col gap-16 md:gap-32 w-full md:w-[calc(50%-20px)] lg:w-[calc(33%-40px)] xlg:w-full">
              <span className="font-jakarta font-medium text-h4">Kontakt</span>
              <ul className="md:space-y-8">
                {kontaktArr.map((kontaktItem, index) => {
                  const rawIcon =
                    ((kontaktItem as unknown) && (kontaktItem as any).Kontakt_icon) ??
                    ((kontaktItem as unknown) && (kontaktItem as any).kontakt_icon)
                  // Note: two casts above are minimal and only for extracting possibly different field names
                  // but we avoided `any` elsewhere — if you want, rename the payload field to a single consistent name.
                  const iconUrl = getMediaUrl(rawIcon) ?? ''
                  const iconAlt = getMediaAlt(rawIcon) ?? 'icon'
                  const linkObj = getFirstLink(kontaktItem)

                  const href = linkObj?.url ?? undefined
                  const openInNewTab = !!linkObj?.newTab || linkObj?.target === '_blank'
                  const target = openInNewTab ? '_blank' : undefined
                  const rel = openInNewTab ? 'noopener noreferrer' : undefined

                  return (
                    <li key={(kontaktItem as any)?.id ?? index}>
                      <div className="flex items-start gap-8">
                        {iconUrl ? (
                          <Image
                            src={iconUrl}
                            alt={iconAlt}
                            role="img"
                            width={20}
                            height={20}
                            className="w-20 h-20"
                          />
                        ) : null}
                        {href ? (
                          <Link className="text-white" href={href} target={target} rel={rel}>
                            <span dangerouslySetInnerHTML={{ __html: linkObj?.label ?? '' }} />
                          </Link>
                        ) : null}
                      </div>
                    </li>
                  )
                })}
              </ul>

              {/* Social icons */}
              <div className="flex gap-16 justify-start items-center">
                {socialArr.map((item, i) => {
                  const firstLink = getFirstLink(item)
                  const href =
                    firstLink?.url ??
                    (item as unknown as { social_url?: string })?.social_url ??
                    null
                  if (!href) return null

                  const openInNewTab = !!firstLink?.newTab || firstLink?.target === '_blank'
                  const target = openInNewTab ? '_blank' : undefined
                  const rel = openInNewTab ? 'noopener noreferrer' : undefined

                  const src =
                    getMediaUrl((item as unknown as { social_icon?: MediaLike })?.social_icon) ??
                    '/images/placeholder-social.png'
                  const alt =
                    getMediaAlt((item as unknown as { social_icon?: MediaLike })?.social_icon) ??
                    firstLink?.label ??
                    'social icon'
                  const width =
                    getMediaWidth((item as unknown as { social_icon?: MediaLike })?.social_icon) ??
                    24
                  const height =
                    getMediaHeight((item as unknown as { social_icon?: MediaLike })?.social_icon) ??
                    24

                  return (
                    <Link href={href} key={(item as any)?.id ?? i} legacyBehavior>
                      <a role="link" target={target} rel={rel}>
                        <Image src={src} alt={alt} width={width} height={height} />
                      </a>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Öffnungszeiten */}
            <div className="flex flex-col gap-16 md:gap-32 w-full md:w-[calc(50%-20px)] lg:w-[calc(33%-40px)] xlg:w-full">
              <span className="font-jakarta font-medium text-h4/snug">Öffnungszeiten</span>
              <ul className="timings-list [&_li]:grid [&_li]:grid-cols-[120px_1fr] space-y-8 *:leading-snug">
                {sprechzeitenArr.map((item, idx) => (
                  <li key={(item as any)?.id ?? idx}>
                    <span className="font-semibold">{(item as any)?.day}</span>
                    {(item as any)?.time}
                  </li>
                ))}
              </ul>
            </div>

            {/* Navigation */}
            <div className="flex flex-col gap-16 md:gap-32 w-full md:w-[calc(50%-20px)] lg:w-[calc(33%-40px)] xlg:w-full">
              <span className="font-jakarta font-medium text-h4/snug">Navigation</span>
              <ul className="space-y-8 *:leading-snug">
                {menusArr.map((item) => {
                  const link =
                    (
                      item as unknown as {
                        link?: { url?: string; label?: string; target?: string }
                      }
                    )?.link ?? {}
                  const href = link?.url
                  if (!href) return null

                  const label = link?.label ?? 'Menu item'
                  const openInNewTab = link?.target === '_blank' || !!(link as any).newTab
                  const target = openInNewTab ? '_blank' : undefined
                  const rel = openInNewTab ? 'noopener noreferrer' : undefined

                  return (
                    <li key={(item as any)?.id ?? href}>
                      <Link href={href} legacyBehavior>
                        <a
                          role="link"
                          onClick={(e) =>
                            handleSmoothScroll(e, href.startsWith('#') ? href : undefined)
                          }
                          target={target}
                          rel={rel}
                        >
                          {label}
                        </a>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Rechtliches */}
            <div className="flex flex-col gap-16 md:gap-32 w-full md:w-[calc(50%-20px)] lg:w-[calc(33%-40px)] xlg:w-full">
              <span className="font-jakarta font-medium text-h4/snug">Rechtliches </span>
              <ul className="space-y-8 *:leading-snug">
                {legalArr.map((item) => {
                  const linkObj = getFirstLink(item)
                  const href = linkObj?.url
                  if (!href) return null
                  return (
                    <li key={(item as any)?.id ?? href}>
                      <Link href={href} role="link">
                        {linkObj?.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
