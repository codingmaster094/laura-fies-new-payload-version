import type { GlobalConfig } from 'payload'
import { revalidateHeader } from './hooks/revalidateHeader'
import { linkGroup } from '@/fields/linkGroup'
export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'Header_Logo',
      type: 'upload',
      label: {
        en: 'Logo',
        de: 'Logo',
      },
      relationTo: 'media',
      required: false,
    },
    {
      name: 'Mobile_Header_Logo',
      type: 'upload',
      label: {
        en: 'Mobile Logo',
        de: 'Mobiles Logo',
      },
      relationTo: 'media',
      required: false,
    },

    // keep your existing top-level linkGroup (unchanged)
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
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
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
