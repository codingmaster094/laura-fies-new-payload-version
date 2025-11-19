'use client'

import React from 'react'
import Image from 'next/image'
import { ImageMedia } from '@/components/Media/ImageMedia'
import type { Media } from '@/payload-types'
import Link from 'next/link'

type LinkItem = {
  label?: string
  url?: string
  appearance?: 'default' | 'outline' | string
}

type PersonalvermittlungBlockProps = {
  blockType?: 'personalvermittlung'
  heading?: string
  aboutImage?: Media | string | null
  // Accept either an array of blocks or an object with root.children
  richText?: any | any[]
  links?: LinkItem[]
}

export const PersonalvermittlungBlock: React.FC<PersonalvermittlungBlockProps> = ({
  heading,
  aboutImage,
  richText,
  links,
}) => {
  // Normalize: if richText is an array use it, otherwise look for root.children, otherwise empty array
  const blocks: any[] = Array.isArray(richText) ? richText : (richText?.root?.children ?? [])

  return (
    <section className="relative py-32 md:py-70 xl:py-160 bg-primary_1" id="uber-mich">
      <div className="relative z-10" id="Gebrauchtwagen">
        <div className="container">
          <div className="flex flex-col-reverse lg:flex-row-reverse gap-20 lg:gap-64">
            <div className="w-full lg:w-1/2 xxl:w-9/12 flex flex-col gap-32">
              <div className="text-white">
                <h2
                  className="text-h2/snug font-normal font-jakarta"
                  dangerouslySetInnerHTML={{ __html: heading || '' }}
                ></h2>
              </div>
              <div className="line max-w-225 w-full border border-solid border-grey1"></div>
              <div className="text-body space-y-16">
                {blocks.length > 0 &&
                  blocks.map((block: any, index: number) => {
                    if (block.type === 'list') {
                      return (
                        <ul key={index} className="leading-snug pl-24 [&_li]:list-disc space-y-16">
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
                        <h3
                          key={index}
                          className="text-h3 font-medium text-center px-16"
                          dangerouslySetInnerHTML={{
                            __html: Array.isArray(block.children)
                              ? block.children.map((child: any) => child.text).join(' ')
                              : '',
                          }}
                        ></h3>
                      )
                    } else {
                      return null
                    }
                  })}
              </div>
              {Array.isArray(links) && links.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-4">
                  {links.map((l, i) => (
                    <Link
                      key={i}
                      href={l.url || '#'}
                      className={`inline-block px-6 py-3 rounded-2xl text-sm font-medium transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        l.appearance === 'outline'
                          ? 'bg-transparent border border-white text-white'
                          : 'bg-white text-primary_1'
                      }`}
                      aria-label={l.label || 'link'}
                    >
                      {l.label || l.url}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="relative w-full lg:w-1/2 xxl:w-full xxl:-ml-[calc((100vw-1470px)/2)] aspect-2/1">
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
                    className="relative lg:sticky top-0 lg:top-50 xxl:top-0 xxl:relative w-full h-auto object-cover"
                  />
                ) : (
                  <ImageMedia
                    resource={aboutImage}
                    fill
                    alt={''}
                    className="relative lg:sticky top-0 lg:top-50 xxl:top-0 xxl:relative w-full h-auto object-cover"
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

export default PersonalvermittlungBlock
