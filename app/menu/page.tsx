import type { Metadata } from 'next'
import db from '@/lib/db'
import { PageHero } from '@/components/page-hero'
import { MenuNav } from '@/components/menu/menu-nav'
import { MenuSection } from '@/components/menu/menu-section'
import { CtaBand } from '@/components/cta-band'

export const metadata: Metadata = {
  title: 'Menu — Anything Else',
  description:
    'Explore our espresso bar, slow-brew and cold coffees, and bakery — all roasted and baked in-house.',
}

export const dynamic = 'force-dynamic'

type MenuItem = {
  id?: number
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
  try {
    const { data: categories, error: categoryError } =
      await db
        .from('menu_categories')
        .select('id, title, blurb, sort_order, is_visible')
        .eq('is_visible', true)
        .order('sort_order', { ascending: true })

    if (categoryError) {
      throw categoryError
    }

    const { data: items, error: itemError } =
      await db
        .from('menu_items')
        .select(
          'id, category_id, name, description, price, image, tag, sort_order, is_available'
        )
        .eq('is_available', true)
        .order('sort_order', { ascending: true })

    if (itemError) {
      throw itemError
    }

    const menu: MenuCategory[] = (categories ?? []).map(
      (category) => ({
        id: String(category.id),
        title: category.title,
        blurb: category.blurb,
        items: (items ?? [])
          .filter(
            (item) =>
              String(item.category_id) ===
              String(category.id)
          )
          .map((item) => ({
            id: Number(item.id),
            name: item.name,
            description: item.description,
            price: String(item.price),
            image: item.image || undefined,
            tag: item.tag || undefined,
          })),
      })
    )

    return menu.filter(
      (category) => category.items.length > 0
    )
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