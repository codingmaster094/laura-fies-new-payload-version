'use client'

import React, { useEffect, useRef, useState } from 'react'
import Lenis from '@studio-freight/lenis'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

type FAQItem = {
  Heading?: string
  richText?: any
}

type FAQBlockProps = {
  blockType?: 'faq'
  Heading?: string // Block Heading
  richText?: any // Block Description richText
  FAQdata?: FAQItem[] // Array of FAQ items
}

export const FAQBlock: React.FC<FAQBlockProps> = ({ FAQdata, Heading, richText }) => {
  const lenisRef = useRef<Lenis | null>(null)
  const sections: FAQItem[] = Array.isArray(FAQdata)
    ? FAQdata
    : Array.isArray(FAQdata)
      ? FAQdata
      : []

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

  if (sections.length === 0) return null
  console.log('sections', Heading, richText)
  return (
    <section className="py-20">
      <div className="container">
        <div className="flex flex-col gap-32 lg:gap-48 justify-center items-center text-center">
          <h2 className="text-h2/snug font-jakarta font-normal">
            {Heading || 'FAQ zur Personalvermittlung in Nordrhein-Westfalen'}
          </h2>
          <div className="line max-w-225 w-full border-1 border-solid border-grey1"></div>
        </div>
        <div>
          {richText?.root?.children &&
            richText?.root?.children.map((block, index) => {
              if (block.type === 'list') {
                return (
                  <ul key={index} className="pl-20 list-disc space-y-8">
                    {block.children.map((item, i) => (
                      <li key={i}>{item.children[0].text}</li>
                    ))}
                  </ul>
                )
              } else if (block.type === 'paragraph') {
                return <p key={index}>{block.children.map((child) => child.text).join(' ')}</p>
              } else if (block.type === 'heading') {
                return (
                  <span
                    key={index}
                    className="block font-medium"
                    dangerouslySetInnerHTML={{
                      __html: block.children.map((child) => child.text).join(' '),
                    }}
                  ></span>
                )
              } else {
                return null
              }
            })}
        </div>
        <div className="space-y-32 mt-32 lg:mt-48">
          {FAQdata &&
            FAQdata.map((faq, index) => {
              console.log('faq', faq)
              const content = faq.richText?.root?.children || []

              const renderContent = (nodes) => {
                return nodes.map((node, i) => {
                  if (node.type === 'paragraph') {
                    const text = node.children?.map((c) => c.text).join(' ') || ''
                    return (
                      <p key={i} className="mb-4">
                        {text}
                      </p>
                    )
                  }
                  if (node.type === 'list') {
                    const items = node.children || []
                    return (
                      <ul key={i} className="list-disc pl-24 mb-20 space-y-8">
                        {items.map((item, j) => {
                          const itemText = item.children?.map((c) => c.text).join(' ') || ''
                          return <li key={j}>{itemText}</li>
                        })}
                      </ul>
                    )
                  }
                  if (node.type === 'listitem') {
                    const itemText = node.children?.map((c) => c.text).join(' ') || ''
                    return <li key={i}>{itemText}</li>
                  }
                  if (node.type === 'linebreak') {
                    return <br key={i} />
                  }
                  if (node.children) {
                    return <React.Fragment key={i}>{renderContent(node.children)}</React.Fragment>
                  }
                  return null
                })
              }

              return (
                <div
                  key={faq.id || index}
                  className="accordion-item border border-dark overflow-hidden active"
                >
                  <button
                    className="accordion-header w-full flex justify-between items-center px-24 py-24 text-left font-jakarta text-h3/snug cursor-pointer"
                    aria-label={faq.Heading}
                  >
                    <span>{faq.Heading}</span>
                    {/* <span className="icon">-</span> */}
                  </button>

                  <div className="accordion-content overflow-hidden transition-all duration-500 ease-in-out">
                    <div className="px-24 pb-24 text-dark text-base_sm leading-relaxed space-y-16">
                      {renderContent(content)}
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </section>
  )
}

export default FAQBlock
