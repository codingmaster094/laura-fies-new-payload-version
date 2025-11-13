// heros/LowImpact/index.tsx
import React from 'react'
import type { Page } from '@/payload-types'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'

type LowImpactHeroProps = Partial<
  Pick<Page['hero'], 'heading' | 'heroImage' | 'richText' | 'links'>
> & {
  children?: React.ReactNode
}

export const LowImpactHero: React.FC<LowImpactHeroProps> = ({
  heading,
  children,
  richText,
  heroImage,
  links,
}) => {
  return (
    <>
      <section className="h-full xxl:h-[calc(100vh-100px)] overflow-hidden">
        <div className="relative h-full flex justify-center items-center flex-col lg:flex-row">
          {heroImage && typeof heroImage === 'object' && (
            <Media
              resource={heroImage}
              imgClassName="aspect-square lg:aspect-auto mr-0 ml-auto relative lg:absolute lg:top-0 right-0 lg:-right-2/12 z-0 h-full object-cover"
            />
          )}

          <div className="container">
            <div className="h-full relative z-10 flex flex-col space-y-16 lg:mt-0 mt-32 mb-32 lg:mb-0 lg:py-100">
              <div className="lg:py-32 lg:px-48 bg-white w-fit font-jakarta font-normal space-y-8">
                {/* Render heading only when it's defined and non-empty */}
                {heading ? (
                  <h1
                    className="text-h1 font-jakarta font-normal leading-snug"
                    dangerouslySetInnerHTML={{ __html: heading }}
                  />
                ) : null}
              </div>

              <div className="lg:py-32 lg:px-48 bg-white w-fit font-jakarta font-normal max-w-[939px] space-y-48">
                <ul className="para text-dark text-h4 leading-snug pl-24 [&_li]:list-disc space-y-24">
                  {children || (richText && <RichText data={richText} enableGutter={false} />)}
                </ul>

                {Array.isArray(links) && links.length > 0 && (
                  <div className="mt-8">
                    {links.map(({ link }, i) => (
                      <CMSLink key={i} {...link} className="btn-dark block h-full" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
