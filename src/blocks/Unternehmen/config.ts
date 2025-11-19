import type { Block } from 'payload'

export const Unternehmen: Block = {
  slug: 'unternehmen',
  interfaceName: 'UnternehmenBlock',
  fields: [
    {
      name: 'sectionTitle',
      type: 'text',
      label: {
        en: 'Section Title',
        de: 'Abschnitts-Titel',
      },
      required: true,
    },
    {
      name: 'introText',
      type: 'textarea',
      label: {
        en: 'Intro / Subtitle',
        de: 'Einleitung / Untertitel',
      },
      admin: {
        description: 'Short descriptive text below the section title.',
      },
    },

    // CTA area (centered button in screenshot)
    {
      name: 'cta',
      type: 'group',
      label: { en: 'Call to action', de: 'Call-to-Action' },
      fields: [
        {
          name: 'text',
          type: 'text',
          label: { en: 'CTA text', de: 'CTA Text' },
        },
        {
          name: 'link',
          type: 'text',
          label: { en: 'CTA link (internal or external)', de: 'CTA Link' },
        },
        {
          name: 'show',
          type: 'checkbox',
          label: { en: 'Show CTA', de: 'CTA anzeigen' },
        },
      ],
    },

    // Top carousel / card row (matches your top row)
    {
      name: 'cardsGroupTop',
      label: { en: 'Top Cards (carousel/row)', de: 'Obere Karten (Reihe)' },
      type: 'array',
      minRows: 0,
      maxRows: 12,
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: { en: 'Icon / Image', de: 'Icon / Bild' },
          admin: {
            description: 'Small icon shown in card corner',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: { en: 'Card Title', de: 'Karten-Titel' },
          required: true,
        },
        {
          name: 'description',
          type: 'richText',
          label: { en: 'Description', de: 'Beschreibung' },
          admin: {
            description: 'Longer description shown inside the card',
            // If you want to use a custom lexical editor implementation
            // you can configure admin components here. Example placeholder:
            // components: { Field: lexicalEditor(...) }
            // (Make sure the lexicalEditor API matches your import)
          },
        },
        {
          name: 'badgeNumber',
          type: 'number',
          label: { en: 'Badge Number', de: 'Badge Nummer' },
          admin: { description: 'Small numeric badge in card' },
        },
        {
          name: 'link',
          type: 'group',
          label: { en: 'Card Link (optional)', de: 'Karten-Link (optional)' },
          fields: [
            { name: 'label', type: 'text', label: { en: 'Label', de: 'Bezeichnung' } },
            { name: 'url', type: 'text', label: { en: 'URL', de: 'URL' } },
          ],
        },
        {
          name: 'accentBox',
          type: 'checkbox',
          label: { en: 'Show accent box / number card', de: 'Akzentbox anzeigen' },
        },
      ],
    },

    // Bottom carousel / card row (matches the lower row)
    {
      name: 'cardsGroupBottom',
      label: { en: 'Bottom Cards (carousel/row)', de: 'Untere Karten (Reihe)' },
      type: 'array',
      minRows: 0,
      maxRows: 12,
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: { en: 'Icon / Image', de: 'Icon / Bild' },
        },
        {
          name: 'title',
          type: 'text',
          label: { en: 'Card Title', de: 'Karten-Titel' },
        },
        {
          name: 'description',
          type: 'richText',
          label: { en: 'Description', de: 'Beschreibung' },
        },
        {
          name: 'badgeNumber',
          type: 'number',
          label: { en: 'Badge Number', de: 'Badge Nummer' },
        },
        {
          name: 'link',
          type: 'group',
          label: { en: 'Card Link (optional)', de: 'Karten-Link (optional)' },
          fields: [
            { name: 'label', type: 'text', label: { en: 'Label', de: 'Bezeichnung' } },
            { name: 'url', type: 'text', label: { en: 'URL', de: 'URL' } },
          ],
        },
      ],
    },

    // Optional controls for arrows/pagination and layout choices
    {
      name: 'showNavigationArrows',
      type: 'checkbox',
      label: { en: 'Show navigation arrows', de: 'Navigations-Pfeile anzeigen' },
      defaultValue: true,
    },
    {
      name: 'cardsPerView',
      type: 'select',
      label: { en: 'Cards visible per view', de: 'Karten pro Ansicht' },
      options: [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ],
      defaultValue: '3',
    },

    // Small visual settings (optional)
    {
      name: 'background',
      type: 'select',
      label: { en: 'Background style', de: 'Hintergrundstil' },
      options: [
        { label: 'White', value: 'white' },
        { label: 'Dark', value: 'dark' },
        { label: 'Muted', value: 'muted' },
      ],
      defaultValue: 'white',
    },
  ],
  labels: {
    plural: 'Unternehmen',
    singular: 'Unternehmen',
  },
}

export default Unternehmen
