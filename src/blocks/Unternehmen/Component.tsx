'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Lenis from '@studio-freight/lenis'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

type LinkItem = {
  label?: string
  url?: string
  appearance?: 'default' | 'outline' | string
  // payload shape is deeply nested — keep flexible
  slider?: any
  sliderHeading?: string
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

type UnternehmenBlockProps = {
  // `data` is the Payload block data you get from API
  data?: any
  // legacy single richText prop (if used)
  richText?: any
}

const normalizeBlocks = (input: any) => {
  // If already an array (e.g. lexical editor exported as an array), return it
  if (Array.isArray(input)) return input
  // If lexical object with root.children
  if (input && typeof input === 'object') {
    if (Array.isArray(input.root?.children)) return input.root.children
    // some payloads store blocks in input.children etc.
    if (Array.isArray(input.children)) return input.children
  }
  return []
}

export const UnternehmenBlock: React.FC<UnternehmenBlockProps> = ({ data, richText }) => {
  // Allow the older prop `richText` or prefer `data.link_title` from payload
  // If your page provides `data`, pass it when rendering the block.
  // e.g. <UnternehmenBlock data={block} />
  const blocks = normalizeBlocks(richText)

  const [mainTab, setMainTab] = useState<number>(0)
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
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    const equalizeHeights = () => {
      if (window.innerWidth < 768) return
      document.querySelectorAll('.swiper').forEach((swiperEl) => {
        const titles = swiperEl.querySelectorAll<HTMLElement>('.js-title')
        const texts = swiperEl.querySelectorAll<HTMLElement>('.js-content')

        titles.forEach((el) => (el.style.minHeight = ''))
        texts.forEach((el) => (el.style.minHeight = ''))

        let maxTitle = 0
        let maxText = 0

        titles.forEach((el) => (maxTitle = Math.max(maxTitle, el.offsetHeight)))
        texts.forEach((el) => (maxText = Math.max(maxText, el.offsetHeight)))

        titles.forEach((el) => (el.style.minHeight = `${maxTitle}px`))
        texts.forEach((el) => (el.style.minHeight = `${maxText}px`))
      })
    }

    equalizeHeights()
    window.addEventListener('resize', equalizeHeights)
    return () => window.removeEventListener('resize', equalizeHeights)
  }, [mainTab])

  // If there's no data or expected array, don't render anything
  if (!data || !Array.isArray(data.link_title)) return null

  return (
    <></>
    // <section className="py-80 xl:min-h-screen bg-gray-50" id="personalvermittlung">
    //   <div className="max-w-1570 mx-auto">
    //     <div className="flex justify-center gap-24 mb-64">
    //       {data.link_title.map((tab: any, idx: number) => (
    //         <button
    //           key={tab?.id ?? idx}
    //           onClick={() => setMainTab(idx)}
    //           className={`px-12 sm:px-32 py-12 border border-black font-medium cursor-pointer ${
    //             mainTab === idx ? 'bg-black text-white' : 'bg-white text-black'
    //           }`}
    //         >
    //           {tab?.title?.label || tab?.label || `Tab ${idx + 1}`}
    //         </button>
    //       ))}
    //     </div>

    //     {data.link_title.map((main: any, mainIdx: number) =>
    //       mainIdx === mainTab ? (
    //         <div key={mainIdx} className="space-y-96">
    //           {Array.isArray(main?.sub_title)
    //             ? main.sub_title.map((sub: any, subIdx: number) => (
    //                 <div key={sub?.id ?? subIdx} className="space-y-64">
    //                   {Array.isArray(sub?.links) &&
    //                     sub.links.map((linkItem: any, linkIdx: number) => {
    //                       const sliderItems: any[] =
    //                         (linkItem?.slider?.[0]?.['Slider Item'] as any[]) ?? []
    //                       const ctaItems: CTAItem[] =
    //                         (linkItem?.slider?.[0]?.['CTA Item'] as CTAItem[]) ?? []

    //                       return (
    //                         <div key={linkIdx} className="space-y-48">
    //                           {linkItem?.sliderHeading && (
    //                             <h3 className="text-h3 font-medium text-center px-16">
    //                               {linkItem.sliderHeading}
    //                             </h3>
    //                           )}

    //                           {sliderItems.length > 0 && (
    //                             <Swiper
    //                               modules={[Navigation, Pagination, Autoplay]}
    //                               loop={true}
    //                               autoplay={{ delay: 4500 }}
    //                               navigation={true}
    //                               pagination={{
    //                                 clickable: true,
    //                                 enabled: true,
    //                               }}
    //                               slidesPerView={1}
    //                               spaceBetween={64}
    //                               breakpoints={{
    //                                 1366: {
    //                                   slidesPerView: 3,
    //                                   spaceBetween: 64,
    //                                   pagination: { enabled: false },
    //                                 },
    //                                 1200: {
    //                                   slidesPerView: 3,
    //                                   spaceBetween: 64,
    //                                   pagination: { enabled: false },
    //                                 },
    //                                 768: {
    //                                   slidesPerView: 2,
    //                                   spaceBetween: 32,
    //                                   pagination: { enabled: false },
    //                                 },
    //                                 640: {
    //                                   slidesPerView: 1,
    //                                   spaceBetween: 32,
    //                                   pagination: { enabled: true },
    //                                 },
    //                               }}
    //                               className="my-32 !px-32 xl:!px-60"
    //                             >
    //                               {sliderItems.map((item: any, index: number) => {
    //                                 const imageUrl =
    //                                   item?.sliderImage?.url ||
    //                                   item?.sliderImage?.src ||
    //                                   item?.sliderImage?.full?.url ||
    //                                   null

    //                                 const contentBlocks = normalizeBlocks(item?.richText)

    //                                 return (
    //                                   <SwiperSlide key={index} className="!h-auto">
    //                                     <div className="bg-primary_1 text-white rounded shadow-md h-full flex flex-col p-32 relative border-5 border-solid border-primary_1">
    //                                       <div className="h-full flex flex-col justify-between flex-grow">
    //                                         {imageUrl && (
    //                                           <div className="mb-32 md:mb-80">
    //                                             <Image
    //                                               src={imageUrl}
    //                                               alt={item.sliderImage?.alt || 'slider image'}
    //                                               width={192}
    //                                               height={192}
    //                                               className="w-48 h-48"
    //                                             />
    //                                           </div>
    //                                         )}

    //                                         <div className="flex flex-col flex-grow">
    //                                           <h3 className="font-normal font-jakarta text-h3/snug mb-24 js-title">
    //                                             {item.Heading}
    //                                           </h3>

    //                                           {contentBlocks.map((block: any, bIdx: number) => {
    //                                             if (block.type === 'list') {
    //                                               return (
    //                                                 <ul
    //                                                   key={bIdx}
    //                                                   className="leading-snug pl-24 [&_li]:list-disc space-y-16"
    //                                                 >
    //                                                   {Array.isArray(block.children) &&
    //                                                     block.children.map((li: any, i: number) => (
    //                                                       <li key={i}>
    //                                                         {li?.children?.[0]?.text ?? ''}
    //                                                       </li>
    //                                                     ))}
    //                                                 </ul>
    //                                               )
    //                                             } else if (block.type === 'paragraph') {
    //                                               return (
    //                                                 <p
    //                                                   key={bIdx}
    //                                                   className="text-base txt-body js-content"
    //                                                 >
    //                                                   {Array.isArray(block.children)
    //                                                     ? block.children
    //                                                         .map((c: any) => c.text)
    //                                                         .join(' ')
    //                                                     : ''}
    //                                                 </p>
    //                                               )
    //                                             } else if (block.type === 'heading') {
    //                                               return (
    //                                                 <h3
    //                                                   key={bIdx}
    //                                                   className="text-h3 font-medium text-center px-16"
    //                                                 >
    //                                                   {Array.isArray(block.children)
    //                                                     ? block.children
    //                                                         .map((c: any) => c.text)
    //                                                         .join(' ')
    //                                                     : ''}
    //                                                 </h3>
    //                                               )
    //                                             } else {
    //                                               return null
    //                                             }
    //                                           })}
    //                                         </div>
    //                                       </div>

    //                                       <div className="box w-100 h-100 bg-white flex justify-center items-center ml-auto -mr-32 -mb-32">
    //                                         <span className="font-jakarta font-medium text-4xl text-black">
    //                                           {index + 1}
    //                                         </span>
    //                                       </div>
    //                                     </div>
    //                                   </SwiperSlide>
    //                                 )
    //                               })}
    //                             </Swiper>
    //                           )}

    //                           <div className="container">
    //                             {ctaItems.length > 0 && (
    //                               <div className="p-32 my-64 space-y-24 text-center">
    //                                 {ctaItems.map((cta, idx) => {
    //                                   const ctaBlocks = normalizeBlocks(cta?.richText)
    //                                   return (
    //                                     <div
    //                                       key={idx}
    //                                       className="flex flex-col items-center gap-24"
    //                                     >
    //                                       <h2 className="text-h2/snug text-center">
    //                                         {cta.CTAHeading}
    //                                       </h2>
    //                                       <div className="line max-w-225 w-full border-1 border-solid border-grey1"></div>

    //                                       {ctaBlocks.map((block: any, bIdx: number) => {
    //                                         if (block.type === 'list') {
    //                                           return (
    //                                             <ul
    //                                               key={bIdx}
    //                                               className="leading-snug pl-24 [&_li]:list-disc space-y-16"
    //                                             >
    //                                               {Array.isArray(block.children) &&
    //                                                 block.children.map((li: any, i: number) => (
    //                                                   <li key={i}>
    //                                                     {li?.children?.[0]?.text ?? ''}
    //                                                   </li>
    //                                                 ))}
    //                                             </ul>
    //                                           )
    //                                         } else if (block.type === 'paragraph') {
    //                                           return (
    //                                             <p key={bIdx}>
    //                                               {Array.isArray(block.children)
    //                                                 ? block.children
    //                                                     .map((c: any) => c.text)
    //                                                     .join(' ')
    //                                                 : ''}
    //                                             </p>
    //                                           )
    //                                         } else if (block.type === 'heading') {
    //                                           return (
    //                                             <h3
    //                                               key={bIdx}
    //                                               className="text-h3 font-medium text-center px-16"
    //                                             >
    //                                               {Array.isArray(block.children)
    //                                                 ? block.children
    //                                                     .map((c: any) => c.text)
    //                                                     .join(' ')
    //                                                 : ''}
    //                                             </h3>
    //                                           )
    //                                         } else {
    //                                           return null
    //                                         }
    //                                       })}

    //                                       {cta.CTA_link && (
    //                                         <Link
    //                                           href={cta.CTA_link.url || '#'}
    //                                           onClick={(e) =>
    //                                             handleSmoothScroll(e, cta.CTA_link.url)
    //                                           }
    //                                           target={cta.CTA_link.target}
    //                                           className="inline-block px-24 py-12 bg-black text-white hover:bg-gray-800 transition"
    //                                         >
    //                                           {cta.CTA_link.label || 'Learn more'}
    //                                         </Link>
    //                                       )}
    //                                     </div>
    //                                   )
    //                                 })}
    //                               </div>
    //                             )}
    //                           </div>
    //                         </div>
    //                       )
    //                     })}
    //                 </div>
    //               ))
    //             : null}
    //         </div>
    //       ) : null,
    //     )}
    //   </div>
    // </section>
  )
}

export default UnternehmenBlock
