import React from 'react'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

// define props shape (adjust types to your project)
export interface PersonalvermittlungLink {
  link?: {
    // adjust these to match your CMSLink props
    href?: string
    label?: string
    target?: string
  }
}

export interface PersonalvermittlungBlockProps {
  links?: PersonalvermittlungLink[]
  richText?: any // replace `any` with your rich text type if available
}

// typed component using the props interface
const PersonalvermittlungBlock: React.FC<PersonalvermittlungBlockProps> = ({
  links = [],
  richText,
}) => {
  return (
    <div className="container">
      <div className="bg-card rounded border-border border p-4 flex flex-col gap-8 md:flex-row md:justify-between md:items-center">
        <div className="max-w-[48rem] flex items-center">
          {richText && <RichText className="mb-0" data={richText} enableGutter={false} />}
        </div>

        <div className="flex flex-col gap-8">
          {links.map(({ link }, i) => (
            <CMSLink key={i} size="lg" {...(link ?? {})} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PersonalvermittlungBlock
