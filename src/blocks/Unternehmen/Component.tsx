'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Lenis from '@studio-freight/lenis'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Link from 'next/link'

type SliderItem = {
  sliderImage?: { url?: string; alt?: string }
  Heading?: string
  richText?: any
}

type CTAItem = {
  CTAHeading?: string
  richText?: any
  CTA_link?: {
    label?: string
    url?: string
    target?: string
  }
}

type MainSectionItem = {
  Heading?: string
  choise_slider_cta?: Array<{
    slides?: Array<{
      heading?: string
      SliderItem?: SliderItem[]
    }>
    CTAItem?: CTAItem[]
  }>
}

type UnternehmenBlockProps = {
  blockType?: 'unternehmen'
  MainSection?: MainSectionItem[]
}

export const UnternehmenBlock: React.FC<UnternehmenBlockProps> = ({ MainSection }) => {
  const lenisRef = useRef<Lenis | null>(null)
  const [mainTab, setMainTab] = useState(0)

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

  const handleSmoothScroll = (e: React.MouseEvent, targetId: string) => {
    if (!targetId.startsWith('#')) {
      return
    }

    e.preventDefault()
    const targetEl = document.querySelector(targetId)

    if (!lenisRef.current) {
      if (targetEl instanceof HTMLElement) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      return
    }

    if (targetEl instanceof HTMLElement) {
      lenisRef.current.scrollTo(targetEl, { offset: -80, duration: 1.2 })
    } else {
      lenisRef.current.scrollTo(targetId, { offset: -80, duration: 1.2 })
    }
  }

  const sections: MainSectionItem[] = Array.isArray(MainSection) ? MainSection : []

  if (sections.length === 0) return null

  return (
    <section className="py-80 xl:min-h-screen bg-gray-50" id="personalvermittlung">
      <div className="max-w-1570 mx-auto">
        {/* MAIN TABS */}
        <div className="flex justify-center gap-24 mb-64">
          {sections.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setMainTab(idx)}
              className={`px-12 sm:px-32 py-12 border border-black font-medium cursor-pointer ${
                mainTab === idx ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              {tab.Heading}
            </button>
          ))}
        </div>

        {/* ACTIVE MAIN TAB CONTENT */}
        {sections.map((main, mainIdx) =>
          mainIdx === mainTab ? (
            <div key={mainIdx} className="space-y-96">
              <div className="space-y-64">
                {main.choise_slider_cta?.map((linkItem, linkIdx) => {
                  const sliderItems = linkItem.slides?.[0] || { SliderItem: [], heading: '' }
                  const ctaItems = linkItem?.CTAItem?.[0] || {}

                  return (
                    <div key={linkIdx} className="space-y-48">
                      {/* Slider Heading */}
                      {sliderItems.heading && (
                        <h3 className="text-h3 font-medium text-center px-16">
                          {sliderItems.heading}
                        </h3>
                      )}
                      <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        loop={true}
                        autoplay={{ delay: 4500 }}
                        navigation={true}
                        pagination={{ clickable: true, enabled: true }}
                        slidesPerView={1}
                        spaceBetween={64}
                        breakpoints={{
                          1366: {
                            slidesPerView: 3,
                            spaceBetween: 64,
                            pagination: { enabled: false },
                          },
                          1200: {
                            slidesPerView: 3,
                            spaceBetween: 64,
                            pagination: { enabled: false },
                          },
                          768: {
                            slidesPerView: 2,
                            spaceBetween: 32,
                            pagination: { enabled: false },
                          },
                          640: {
                            slidesPerView: 1,
                            spaceBetween: 32,
                            pagination: { enabled: true },
                          },
                        }}
                        className="my-32 !px-32 xl:!px-60"
                      >
                        {sliderItems?.SliderItem &&
                          sliderItems?.SliderItem?.map((item, index) => (
                            <SwiperSlide key={index} className="!h-auto">
                              <div className="bg-primary_1 text-white rounded shadow-md h-full flex flex-col p-32 relative border-5 border-solid border-primary_1">
                                <div className="h-full flex flex-col justify-between flex-grow">
                                  {item.sliderImage?.url && (
                                    <Image
                                      src={item.sliderImage.url}
                                      alt={item.sliderImage?.alt || 'slider image'}
                                      width={48}
                                      height={48}
                                      className="w-48 h-48 mb-32 md:mb-80"
                                    />
                                  )}
                                  <div className="flex flex-col flex-grow">
                                    <h3 className="font-normal font-jakarta text-h3/snug mb-24 js-title">
                                      {item.Heading}
                                    </h3>
                                    {item.richText?.root?.children?.map(
                                      (block: any, idx: number) => {
                                        if (block.type === 'list') {
                                          return (
                                            <ul
                                              key={idx}
                                              className="leading-snug pl-24 [&_li]:list-disc space-y-16"
                                            >
                                              {block.children.map((li: any, i: number) => (
                                                <li key={i}>{li.children[0]?.text}</li>
                                              ))}
                                            </ul>
                                          )
                                        } else if (block.type === 'paragraph') {
                                          return (
                                            <p key={idx} className="text-base txt-body js-content">
                                              {block.children
                                                .map((child: any) => child.text)
                                                .join(' ')}
                                            </p>
                                          )
                                        } else if (block.type === 'heading') {
                                          return (
                                            <h3
                                              key={idx}
                                              className="text-h3 font-medium text-center px-16"
                                              dangerouslySetInnerHTML={{
                                                __html: block.children
                                                  .map((c: any) => c.text)
                                                  .join(' '),
                                              }}
                                            ></h3>
                                          )
                                        } else {
                                          return null
                                        }
                                      },
                                    )}
                                  </div>
                                </div>
                                <div className="box w-100 h-100 bg-white flex justify-center items-center ml-auto -mr-32 -mb-32">
                                  <span className="font-jakarta font-medium text-4xl text-black">
                                    {index + 1}
                                  </span>
                                </div>
                              </div>
                            </SwiperSlide>
                          ))}
                      </Swiper>
                      <div className="container">
                        <div className="p-32 my-64 space-y-24 text-center">
                          <div className="flex flex-col items-center gap-24">
                            <h2 className="text-h2/snug text-center">{ctaItems.CTAHeading}</h2>
                            <div className="line max-w-225 w-full border-1 border-solid border-grey1"></div>
                            {ctaItems.richText?.root?.children?.map((block: any, idx: number) => {
                              if (block.type === 'list') {
                                return (
                                  <ul
                                    key={idx}
                                    className="leading-snug pl-24 [&_li]:list-disc space-y-16"
                                  >
                                    {block.children.map((li: any, i: number) => (
                                      <li key={i}>{li.children[0]?.text}</li>
                                    ))}
                                  </ul>
                                )
                              } else if (block.type === 'paragraph') {
                                return (
                                  <p key={idx}>
                                    {block.children.map((c: any) => c.text).join(' ')}
                                  </p>
                                )
                              } else if (block.type === 'heading') {
                                return (
                                  <h3
                                    key={idx}
                                    className="text-h3 font-medium text-center px-16"
                                    dangerouslySetInnerHTML={{
                                      __html: block.children.map((c: any) => c.text).join(' '),
                                    }}
                                  ></h3>
                                )
                              } else {
                                return null
                              }
                            })}
                            {ctaItems.CTA_link && (
                              <Link
                                href={ctaItems.CTA_link.url || '#'}
                                onClick={(e) =>
                                  handleSmoothScroll(e, ctaItems?.CTA_link?.url || '')
                                }
                                target={ctaItems.CTA_link.target}
                                className="inline-block px-24 py-12 bg-black text-white hover:bg-gray-800 transition"
                              >
                                {ctaItems.CTA_link.label}
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : null,
        )}
      </div>
    </section>
  )
}

export default UnternehmenBlock
