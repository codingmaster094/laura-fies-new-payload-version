import type { Block } from 'payload'

import {
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Unternehmen: Block = {
  slug: 'unternehmen',
  interfaceName: 'UnternehmenBlock',
  fields: [
    {
      name: 'MainSection',
      label: { en: 'Main Section', de: 'Hauptabschnitt' },
      type: 'array',
      fields: [
        {
          name: 'Heading',
          type: 'text',
          label: {
            en: 'Heading',
            de: 'Überschrift',
          },
        },
        {
          name: 'choise_slider_cta',
          label: { en: 'Choise slider & CTA', de: 'Auswahl-Schieberegler & CTA' },
          type: 'array',
          fields: [
            {
              name: 'slides',
              label: { en: 'Slides', de: 'Slides' },
              type: 'array',
              minRows: 1,
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  label: { en: 'Heading', de: 'Überschrift' },
                  required: true,
                },
                {
                  name: 'description',
                  type: 'richText',
                  label: { en: 'Description', de: 'Beschreibung' },
                  admin: {
                    description: 'Short paragraph / rich text',
                  },
                  editor: lexicalEditor({
                    features: ({ defaultFeatures }) => [
                      ...defaultFeatures,
                      HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
                      FixedToolbarFeature(),
                      InlineToolbarFeature(),
                      EXPERIMENTAL_TableFeature(),
                    ],
                  }),
                },
                {
                  name: 'SliderItem',
                  label: { en: 'slider Item', de: 'Schieberegler Element' },
                  type: 'array',
                  fields: [
                    {
                      name: 'sliderImage',
                      type: 'upload',
                      label: {
                        en: 'Slider Image',
                        de: 'Slider Bild',
                      },
                      relationTo: 'media',
                      required: false,
                    },
                    {
                      name: 'Heading',
                      type: 'text',
                      label: {
                        en: 'Heading',
                        de: 'Überschrift',
                      },
                    },
                    {
                      name: 'richText',
                      type: 'richText',
                      label: {
                        en: 'Rich Text',
                        de: 'Rich Text',
                      },
                      editor: lexicalEditor({
                        features: ({ defaultFeatures }) => [
                          ...defaultFeatures,
                          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                          FixedToolbarFeature(),
                          InlineToolbarFeature(),
                          EXPERIMENTAL_TableFeature(),
                        ],
                      }),
                    },
                  ],
                },
              ],
            },
            {
              name: 'CTA Item',
              label: { en: 'CTA', de: '' },
              type: 'array',
              fields: [
                {
                  name: 'CTAHeading',
                  type: 'text',
                  label: {
                    en: 'CTA Heading',
                    de: '',
                  },
                },
                {
                  name: 'richText',
                  type: 'richText',
                  label: {
                    en: 'Rich Text',
                    de: 'Rich Text',
                  },
                  editor: lexicalEditor({
                    features: ({ defaultFeatures }) => [
                      ...defaultFeatures,
                      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                      FixedToolbarFeature(),
                      InlineToolbarFeature(),
                      EXPERIMENTAL_TableFeature(),
                    ],
                  }),
                },
                {
                  name: 'CTA_link',
                  type: 'group',
                  label: {
                    en: 'CTA Link',
                    de: '',
                  },
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      label: {
                        en: 'CTA Label',
                        de: '',
                      },
                    },
                    {
                      name: 'url',
                      type: 'text',
                      label: {
                        en: 'URL',
                        de: 'URL',
                      },
                    },
                    {
                      name: 'target',
                      type: 'select',
                      label: {
                        en: 'Target',
                        de: 'Ziel',
                      },
                      options: [
                        { label: { en: 'Same Tab', de: 'Gleiches Tab' }, value: '_self' },
                        { label: { en: 'New Tab', de: 'Neues Tab' }, value: '_blank' },
                      ],
                      defaultValue: '_self',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  labels: {
    plural: 'Unternehmen',
    singular: 'Unternehmen',
  },
}
