import type { GlobalConfig } from 'payload'
import { revalidateFooter } from './hooks/revalidateFooter'
import { linkGroup } from '@/fields/linkGroup'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'Footer_Logo',
      type: 'upload',
      label: {
        en: 'Logo',
        de: 'Logo',
      },
      relationTo: 'media',
      required: false,
    },
    {
      name: 'social',
      label: {
        en: 'Social',
        de: 'Sozial',
      },
      type: 'array',
      labels: {
        singular: { en: 'Social Link', de: 'Sozialer Link' },
        plural: { en: 'Social Links', de: 'Soziale Links' },
      },
      fields: [
        {
          name: 'social_icon',
          type: 'upload',
          relationTo: 'media',
          label: {
            en: 'Social Icon',
            de: 'Sozial Icon',
          },
          required: false,
        },
        linkGroup({
          overrides: {
            maxRows: 5,
          },
        }),
      ],
    },
    {
      name: 'kontakt',
      label: {
        en: 'Contact',
        de: 'Kontakt',
      },
      type: 'array',
      fields: [
        {
          name: 'Kontakt_icon',
          type: 'upload',
          relationTo: 'media',
          label: {
            en: 'Conatct Icon',
            de: 'Kontakt Icon',
          },
          required: true,
        },
        linkGroup({
          overrides: {
            maxRows: 5,
          },
        }),
      ],
    },
    {
      name: 'sprechzeiten',
      label: {
        en: 'Opening Hours',
        de: 'Sprechzeiten',
      },
      type: 'array',
      fields: [
        {
          name: 'day',
          type: 'text',
          label: {
            en: 'Day',
            de: 'Tag',
          },
        },
        {
          name: 'time',
          type: 'text',
          label: {
            en: 'Time',
            de: 'Uhrzeit',
          },
        },
      ],
    },
    {
      name: 'menus',
      label: { en: 'Menus', de: 'Menüs' },
      type: 'array',
      fields: [
        {
          name: 'link',
          type: 'group',
          label: { en: 'Link', de: 'Link' },
          fields: [
            {
              name: 'label',
              type: 'text',
              label: { en: 'Link Label', de: 'Link Beschriftung' },
              localized: true,
            },
            {
              name: 'url',
              type: 'text',
              label: { en: 'URL', de: 'URL' },
              localized: true,
            },
            {
              name: 'target',
              type: 'select',
              label: { en: 'Target', de: 'Ziel' },
              options: [
                {
                  label: { en: 'Same Tab', de: 'Gleiches Tab' },
                  value: '_self',
                },
                {
                  label: { en: 'New Tab', de: 'Neues Tab' },
                  value: '_blank',
                },
              ],
              defaultValue: '_self',
            },
          ],
        },
        {
          name: 'submenus',
          label: { en: 'Submenus', de: 'Untermenu' },
          type: 'array',
          fields: [
            {
              name: 'links',
              label: { en: 'Submenu Links', de: 'Untermenu Links' },
              type: 'array',
              fields: [
                {
                  name: 'link',
                  type: 'group',
                  label: { en: 'Link', de: 'Link' },
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      label: { en: 'Link Label', de: 'Link Beschriftung' },
                      localized: true,
                    },
                    {
                      name: 'url',
                      type: 'text',
                      label: { en: 'URL', de: 'URL' },
                      localized: true,
                    },
                    {
                      name: 'target',
                      type: 'select',
                      label: { en: 'Target', de: 'Ziel' },
                      options: [
                        {
                          label: { en: 'Same Tab', de: 'Gleiches Tab' },
                          value: '_self',
                        },
                        {
                          label: { en: 'New Tab', de: 'Neues Tab' },
                          value: '_blank',
                        },
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
    {
      name: 'legalLinks',
      label: {
        en: 'Legal',
        de: 'Rechtliches',
      },
      type: 'array',
      fields: [
        linkGroup({
          overrides: {
            maxRows: 5,
          },
        }),
      ],
    },
    {
      name: 'copyright',
      type: 'text',
      label: {
        en: 'Copyright Text',
        de: 'Copyright Text',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
