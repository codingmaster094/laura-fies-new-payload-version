'use client'

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import { ImageMedia } from '@/components/Media/ImageMedia'
import type { Media } from '@/payload-types'
import Link from 'next/link'
import Lenis from '@studio-freight/lenis'

type LinkItem = {
  label?: string
  url?: string
  appearance?: 'default' | 'outline' | string
}

type OffeneStellenBlockProps = {
  blockType?: 'offeneStellen'
  heading?: string
  aboutImage?: Media | string | null
  // Accept either an array of blocks or an object with root.children
  richText?: any | any[]
  links?: LinkItem[]
}

export const OffeneStellenBlock: React.FC<OffeneStellenBlockProps> = ({
  heading,
  aboutImage,
  richText,
  links,
}) => {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const scroller = new Lenis({
      duration: 1.2,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    })

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

  // Normalize: if richText is an array use it, otherwise look for root.children, otherwise empty array
  const blocks: any[] = Array.isArray(richText) ? richText : (richText?.root?.children ?? [])

  return (
    <section className="relative py-32 md:py-70 xl:py-160" id="jobs">
      <div className="relative z-10" id="Gebrauchtwagen">
        <div className="container">
          <div className="flex flex-col-reverse lg:flex-row gap-20 lg:gap-64 justify-center items-start xxl:items-center">
            <div className="w-full lg:w-1/2 xxl:w-9/12 flex flex-col gap-32 ">
              <div className="mb-24">
                <div className="mb-24">
                  <h2
                    className="text-h2/snug font-normal font-jakarta"
                    dangerouslySetInnerHTML={{ __html: heading || '' }}
                  ></h2>
                </div>
                <div className="line max-w-225 w-full border-1 border-solid border-grey1"></div>
              </div>
              <div className="space-y-24 text-dark">
                {blocks &&
                  blocks.map((block, index) => {
                    if (block.type === 'list') {
                      return (
                        <ul key={index} className="pl-20 list-disc space-y-8">
                          {Array.isArray(block.children) &&
                            block.children.map((item: any, i: number) => (
                              <li key={i}>{item?.children?.[0]?.text ?? ''}</li>
                            ))}
                        </ul>
                      )
                    } else if (block.type === 'paragraph') {
                      return (
                        <p key={index}>
                          {Array.isArray(block.children)
                            ? block.children.map((child: any) => child.text).join(' ')
                            : ''}
                        </p>
                      )
                    } else if (block.type === 'heading') {
                      return (
                        <span
                          key={index}
                          className="block font-medium"
                          dangerouslySetInnerHTML={{
                            __html: Array.isArray(block.children)
                              ? block.children.map((child: any) => child.text).join(' ')
                              : '',
                          }}
                        ></span>
                      )
                    } else {
                      return null
                    }
                  })}
              </div>
              {Array.isArray(links) && links.length > 0 && (
                <div className="mt-8">
                  {links.map((l, i) => (
                    <Link
                      key={i}
                      href={l.url || '#'}
                      className={`btn-dark block mt-24`}
                      aria-label={l.label || 'link'}
                    >
                      {l.label || l.url}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="w-full lg:w-1/2 xxl:w-full xxl:-mr-[calc((100vw-1470px)/2)] relative lg:sticky lg:top-50">
              {aboutImage ? (
                typeof aboutImage === 'string' ? (
                  <Image
                    src={aboutImage}
                    alt={heading || 'Personalvermittlung Image'}
                    role="img"
                    width={1920}
                    height={900}
                    fetchPriority="high"
                    sizes="(max-width: 1024px) 100vw, 1920px"
                    className="relative lg:sticky lg:top-50  object-cover"
                  />
                ) : (
                  <ImageMedia
                    resource={aboutImage}
                    fill
                    alt={''}
                    className="relative lg:sticky lg:top-50  object-cover"
                  />
                )
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OffeneStellenBlock
