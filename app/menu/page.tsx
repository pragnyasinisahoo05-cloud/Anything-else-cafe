import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { MenuNav } from '@/components/menu/menu-nav'
import { MenuSection } from '@/components/menu/menu-section'
import { CtaBand } from '@/components/cta-band'

export const metadata: Metadata = {
  title: 'Menu — Anything Else',
  description:
    'Explore our espresso bar, slow-brew and cold coffees, and bakery — all roasted and baked in-house.',
}

type MenuItem = {
  name: string
  description: string
  price: string
  image?: string
  tag?: string
}

type MenuCategory = {
  id: string
  title: string
  blurb: string
  items: MenuItem[]
}

async function getMenu(): Promise<MenuCategory[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000'

  try {
    const response = await fetch(`${baseUrl}/api/menu`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(
        `Menu request failed: ${response.status}`,
      )
    }

    const data = await response.json()

    return data.menu ?? []
  } catch (error) {
    console.error('Failed to fetch menu:', error)
    return []
  }
}

export default async function MenuPage() {
  const menu = await getMenu()

  return (
    <main>
      <PageHero
        eyebrow="The Menu"
        title="Everything on the board"
        description="Roasted in-house, brewed with patience, and priced without pretension. Milk alternatives always on the house."
        image="/images/drink-latte.png"
        imageAlt="Caramel latte with delicate latte art"
      />

      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        {menu.length > 0 ? (
          <>
            <MenuNav categories={menu} />

            <div className="mt-4 divide-y divide-border">
              {menu.map((category) => (
                <MenuSection
                  key={category.id}
                  category={category}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="py-20 text-center">
            <p className="font-serif text-2xl text-foreground">
              Our menu is taking a little break.
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              Please check back soon.
            </p>
          </div>
        )}
      </div>

      <CtaBand />
    </main>
  )
}