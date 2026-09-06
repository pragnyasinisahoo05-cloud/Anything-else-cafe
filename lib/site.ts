export const site = {
  name: 'Anything Else',
  tagline: 'Specialty Coffee & Roastery',
  phone: '(415) 555-0172',
  email: 'hello@anythingelse.coffee',
  address: '218 Kingswood Lane, Portland, OR 97204',
  hours: [
    { day: 'Monday – Friday', time: '7:00 — 19:00' },
    { day: 'Saturday', time: '8:00 — 20:00' },
    { day: 'Sunday', time: '8:00 — 17:00' },
  ],
  social: [
    { label: 'Instagram', href: '#' },
    { label: 'Twitter', href: '#' },
    { label: 'Spotify', href: '#' },
  ],
}

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Menu', href: '/menu' },
  { label: 'About', href: '/about' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
]

export type MenuItem = {
  name: string
  description: string
  price: string
  image?: string
  tag?: string
}

export type MenuCategory = {
  id: string
  title: string
  blurb: string
  items: MenuItem[]
}

export const menu: MenuCategory[] = [
  {
    id: 'espresso',
    title: 'Espresso Bar',
    blurb: 'Pulled from our seasonal house blend, roasted in-house each week.',
    items: [
      {
        name: 'Caramel Latte',
        description: 'Double ristretto, steamed milk, house salted-caramel.',
        price: '5.50',
        image: '/images/drink-latte.png',
        tag: 'Signature',
      },
      {
        name: 'Cortado',
        description: 'Equal parts espresso and warm micro-foam milk.',
        price: '4.25',
      },
      {
        name: 'Flat White',
        description: 'Silky steamed milk over a velvety double shot.',
        price: '4.75',
      },
      {
        name: 'Cappuccino',
        description: 'Classic espresso with a thick, cloud-like foam.',
        price: '4.50',
      },
    ],
  },
  {
    id: 'slow',
    title: 'Slow & Cold',
    blurb: 'For the patient. Brewed slow, poured cold, sipped unhurried.',
    items: [
      {
        name: 'Cold Brew',
        description: '18-hour steep, deep chocolate notes, cream swirl.',
        price: '5.00',
        image: '/images/drink-coldbrew.png',
        tag: 'House Favorite',
      },
      {
        name: 'Pour Over',
        description: 'Single-origin, hand-poured. Ask about today’s roast.',
        price: '6.00',
      },
      {
        name: 'Matcha Latte',
        description: 'Ceremonial-grade matcha whisked with oat milk.',
        price: '5.75',
        image: '/images/drink-matcha.png',
      },
      {
        name: 'Iced Mocha',
        description: 'Cold brew, dark chocolate, a whisper of vanilla.',
        price: '5.50',
      },
    ],
  },
  {
    id: 'bakery',
    title: 'From the Bakery',
    blurb: 'Baked before sunrise. When they’re gone, they’re gone.',
    items: [
      {
        name: 'Butter Croissant',
        description: 'Laminated over three days, impossibly flaky.',
        price: '4.00',
        image: '/images/drink-pastry.png',
        tag: 'Baked daily',
      },
      {
        name: 'Almond Danish',
        description: 'Frangipane, toasted almonds, dusted sugar.',
        price: '4.75',
      },
      {
        name: 'Banana Bread',
        description: 'Brown butter, walnuts, a thick honeyed crust.',
        price: '4.25',
      },
      {
        name: 'Seasonal Galette',
        description: 'Whatever the farmers brought us this morning.',
        price: '5.25',
      },
    ],
  },
]

export const gallery = [
  { src: '/images/hero-pour.png', alt: 'Barista pouring latte art', span: 'tall' },
  { src: '/images/gallery-1.png', alt: 'Friends toasting coffee cups', span: 'wide' },
  { src: '/images/interior.png', alt: 'Warm café interior', span: 'normal' },
  { src: '/images/beans.png', alt: 'Freshly roasted coffee beans', span: 'normal' },
  { src: '/images/gallery-3.png', alt: 'Cozy window table with coffee', span: 'tall' },
  { src: '/images/gallery-2.png', alt: 'Latte art close up', span: 'normal' },
  { src: '/images/barista.png', alt: 'Barista at the espresso machine', span: 'normal' },
  { src: '/images/gallery-4.png', alt: 'Coffee roasting drum', span: 'wide' },
]
