import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const MediumImpactHero: React.FC<Page['hero']> = ({ heading ,links, media, heroImage , richText }) => {
   const banner = media && typeof media === 'object' ? media : heroImage && typeof heroImage === 'object' ? heroImage : null
  return (
    <div className="">
      <div className="container mb-8">
        {heading && <h1 className="mb-4 text-3xl md:text-4xl font-semibold">{heading}</h1>}
        {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}

        {Array.isArray(links) && links.length > 0 && (
          <ul className="flex gap-4">
            {links.map(({ link }, i) => {
              return (
                <li key={i}>
                  <CMSLink {...link} />
                </li>
              )
            })}
          </ul>
        )}
      </div>
     <div className="container">
        {banner && (
          <div>
            <Media
              className="-mx-4 md:-mx-8 2xl:-mx-16"
              imgClassName=""
              priority
              resource={banner}
            />
            {banner?.caption && (
              <div className="mt-3">
                <RichText data={banner.caption} enableGutter={false} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
