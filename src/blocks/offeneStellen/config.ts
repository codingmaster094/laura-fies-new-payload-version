import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '../../fields/linkGroup'

export const OffeneStellen: Block = {
  slug: 'offeneStellen',
  interfaceName: 'OffeneStellenBlock',
  fields: [
    {
      name: 'heading',
      label: 'Heading',
      type: 'text',
      required: false,
    },
    {
      name: 'aboutImage',
      label: 'offeneStellen Image',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        maxRows: 2,
      },
    }),
  ],
  labels: {
    plural: 'OffeneStellen',
    singular: 'OffeneStellen',
  },
}
