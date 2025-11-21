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
  // Your Payload block uses `FAQdata` (an array of items). Keep both prop names for compatibility.
  FAQdata?: FAQItem[]
  MainSection?: FAQItem[] // optional if you used different prop earlier
}

export const FAQBlock: React.FC<FAQBlockProps> = ({ FAQdata, MainSection }) => {
  const lenisRef = useRef<Lenis | null>(null)
  const sections: FAQItem[] = Array.isArray(FAQdata)
    ? FAQdata
    : Array.isArray(MainSection)
    ? MainSection
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

  // simple accordion open state
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  if (sections.length === 0) return null

  // Helper to render richText data — best-effort fallback.
  // NOTE: Lexical richtext from Payload can be saved in different shapes.
  // Replace/extend this function to use a proper converter from Lexical -> HTML if you have one.
  const renderRichText = (rt: any) => {
    if (!rt && rt !== 0) return null

    // If the editor saved HTML directly (string)
    if (typeof rt === 'string') {
      return <div dangerouslySetInnerHTML={{ __html: rt }} />
    }

    // If there is an 'html' property
    if (typeof rt === 'object' && rt.html && typeof rt.html === 'string') {
      return <div dangerouslySetInnerHTML={{ __html: rt.html }} />
    }

    // If Lexical JSON is present (common shape: rt.root.children...), there's no universal HTML converter here.
    // We'll attempt a minimal fallback: extract plain text paragraphs.
    try {
      if (typeof rt === 'object' && rt.root && Array.isArray(rt.root.children)) {
        const paragraphs: string[] = []
        for (const node of rt.root.children) {
          if (node.type === 'paragraph' && Array.isArray(node.children)) {
            const text = node.children.map((c: any) => c.text ?? '').join('')
            paragraphs.push(text)
          } else if (node.type === 'heading' && Array.isArray(node.children)) {
            const text = node.children.map((c: any) => c.text ?? '').join('')
            paragraphs.push(`<strong>${text}</strong>`)
          } else {
            // try to stringify small text nodes
            if (node.children && Array.isArray(node.children)) {
              const text = node.children.map((c: any) => c.text ?? '').join('')
              if (text) paragraphs.push(text)
            }
          }
        }
        return (
          <div>
            {paragraphs.map((p, i) => (
              // if string already contains html tags from above, render as html
              <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
            ))}
          </div>
        )
      }
    } catch (e) {
      // ignore and fallback
      // console.warn('Failed to parse lexical shape', e)
    }

    // Last-resort: JSON dump (developer-only — consider removing in production)
    return (
      <pre style={{ whiteSpace: 'pre-wrap', fontSize: 14 }}>
        {JSON.stringify(rt, null, 2)}
      </pre>
    )
  }

  return (
    <section className="faq-block max-w-5xl mx-auto py-12 px-4">
      <div className="faq-grid space-y-6">
        {sections.map((item, idx) => {
          const isOpen = openIndex === idx
          return (
            <div
              key={idx}
              className="faq-item border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${idx}`}
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="faq-question w-full text-left px-5 py-4 flex justify-between items-center"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <span className="text-lg font-medium">
                  {item?.Heading ?? `Question ${idx + 1}`}
                </span>
                <span
                  aria-hidden
                  style={{
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 200ms ease',
                  }}
                >
                  {/* simple plus/minus indicator */}
                  {isOpen ? '−' : '+'}
                </span>
              </button>

              <div
                id={`faq-panel-${idx}`}
                role="region"
                aria-labelledby={`faq-button-${idx}`}
                className="faq-answer px-5 pb-4"
                style={{
                  display: isOpen ? 'block' : 'none',
                }}
              >
                {renderRichText(item?.richText)}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default FAQBlock
