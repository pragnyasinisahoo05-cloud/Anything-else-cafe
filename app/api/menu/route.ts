// app/api/menu/route.ts

import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/admin-auth'

export const runtime = 'nodejs'

// ---------------------------------------------
// GET MENU
// ---------------------------------------------

export async function GET() {
  try {
    const { data: categories, error: categoriesError } =
      await db
        .from('menu_categories')
        .select(`
          id,
          title,
          blurb,
          sort_order,
          is_visible
        `)
        .order('sort_order', { ascending: true })

    if (categoriesError) {
      throw categoriesError
    }

    const { data: items, error: itemsError } =
      await db
        .from('menu_items')
        .select(`
          id,
          category_id,
          name,
          description,
          price,
          image,
          tag,
          sort_order,
          is_available
        `)
        .order('sort_order', { ascending: true })

    if (itemsError) {
      throw itemsError
    }

    const safeCategories = categories ?? []
    const safeItems = items ?? []

    // ---------------------------------------------
    // Full menu for admin
    // ---------------------------------------------

    const adminMenu = safeCategories.map(
      (category) => ({
        ...category,

        items: safeItems.filter(
          (item) =>
            item.category_id === category.id
        ),
      })
    )

    // ---------------------------------------------
    // Customer menu
    //
    // Only visible categories
    // + available items
    // ---------------------------------------------

    const customerMenu =
      safeCategories
        .filter(
          (category) =>
            Number(category.is_visible) === 1
        )
        .map((category) => ({
          id: category.id,
          title: category.title,
          blurb: category.blurb,

          items: safeItems
            .filter(
              (item) =>
                item.category_id ===
                  category.id &&
                Number(item.is_available) === 1
            )
            .map((item) => ({
              name: item.name,
              description: item.description,
              price: item.price,
              image:
                item.image || undefined,
              tag:
                item.tag || undefined,
            })),
        }))
        .filter(
          (category) =>
            category.items.length > 0
        )

    return NextResponse.json({
      menu: customerMenu,
      adminMenu,
    })
  } catch (error) {
    console.error(
      'GET /api/menu error:',
      error
    )

    return NextResponse.json(
      {
        error: 'Failed to load menu.',
      },
      {
        status: 500,
      }
    )
  }
}

// ---------------------------------------------
// POST
// ---------------------------------------------

export async function POST(
  request: Request
) {
  try {
    const authenticated =
      await isAdminAuthenticated()

    if (!authenticated) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
        },
        {
          status: 401,
        }
      )
    }

    const body = await request.json()

    const {
      type,
    } = body

    // =============================================
    // ADD CATEGORY
    // =============================================

    if (type === 'category') {
      const title =
        typeof body.title === 'string'
          ? body.title.trim()
          : ''

      const blurb =
        typeof body.blurb === 'string'
          ? body.blurb.trim()
          : ''

      if (!title || !blurb) {
        return NextResponse.json(
          {
            error:
              'Category title and description are required.',
          },
          {
            status: 400,
          }
        )
      }

      let id =
        typeof body.id === 'string' &&
        body.id.trim()
          ? body.id.trim()
          : title
              .toLowerCase()
              .replace(
                /[^a-z0-9]+/g,
                '-'
              )
              .replace(
                /^-+|-+$/g,
                ''
              )

      if (!id) {
        id = `category-${Date.now()}`
      }

      // Check duplicate category ID
      const { data: existingCategory, error: existingError } =
        await db
          .from('menu_categories')
          .select('id')
          .eq('id', id)
          .maybeSingle()

      if (existingError) {
        throw existingError
      }

      if (existingCategory) {
        return NextResponse.json(
          {
            error:
              'A category with this ID already exists.',
          },
          {
            status: 409,
          }
        )
      }

      // Get next sort order
      const { data: categories, error: sortError } =
        await db
          .from('menu_categories')
          .select('sort_order')
          .order('sort_order', {
            ascending: false,
          })
          .limit(1)

      if (sortError) {
        throw sortError
      }

      const nextSort =
        categories &&
        categories.length > 0
          ? Number(
              categories[0].sort_order
            ) + 1
          : 0

      const { error: insertError } =
        await db
          .from('menu_categories')
          .insert({
            id,
            title,
            blurb,
            sort_order: nextSort,
            is_visible: 1,
          })

      if (insertError) {
        throw insertError
      }

      return NextResponse.json({
        success: true,
        id,
      })
    }

    // =============================================
    // ADD ITEM
    // =============================================

    if (type === 'item') {
      const categoryId =
        typeof body.categoryId === 'string'
          ? body.categoryId.trim()
          : ''

      const name =
        typeof body.name === 'string'
          ? body.name.trim()
          : ''

      const description =
        typeof body.description === 'string'
          ? body.description.trim()
          : ''

      const price =
        typeof body.price === 'string'
          ? body.price.trim()
          : ''

      const image =
        typeof body.image === 'string' &&
        body.image.trim()
          ? body.image.trim()
          : null

      const tag =
        typeof body.tag === 'string' &&
        body.tag.trim()
          ? body.tag.trim()
          : null

      if (
        !categoryId ||
        !name ||
        !description ||
        !price
      ) {
        return NextResponse.json(
          {
            error:
              'Category, name, description and price are required.',
          },
          {
            status: 400,
          }
        )
      }

      // Check category
      const {
        data: category,
        error: categoryError,
      } = await db
        .from('menu_categories')
        .select('id')
        .eq('id', categoryId)
        .maybeSingle()

      if (categoryError) {
        throw categoryError
      }

      if (!category) {
        return NextResponse.json(
          {
            error:
              'Selected category does not exist.',
          },
          {
            status: 400,
          }
        )
      }

      // Get next sort order for this category
      const {
        data: categoryItems,
        error: sortError,
      } = await db
        .from('menu_items')
        .select('sort_order')
        .eq('category_id', categoryId)
        .order('sort_order', {
          ascending: false,
        })
        .limit(1)

      if (sortError) {
        throw sortError
      }

      const nextSort =
        categoryItems &&
        categoryItems.length > 0
          ? Number(
              categoryItems[0].sort_order
            ) + 1
          : 0

      const {
        data: insertedItem,
        error: insertError,
      } = await db
        .from('menu_items')
        .insert({
          category_id: categoryId,
          name,
          description,
          price,
          image,
          tag,
          sort_order: nextSort,
          is_available: 1,
        })
        .select('id')
        .single()

      if (insertError) {
        throw insertError
      }

      return NextResponse.json({
        success: true,
        id: insertedItem.id,
      })
    }

    return NextResponse.json(
      {
        error:
          'Invalid menu type.',
      },
      {
        status: 400,
      }
    )
  } catch (error) {
    console.error(
      'POST /api/menu error:',
      error
    )

    return NextResponse.json(
      {
        error:
          'Failed to create menu entry.',
      },
      {
        status: 500,
      }
    )
  }
}

// ---------------------------------------------
// PATCH
// ---------------------------------------------

export async function PATCH(
  request: Request
) {
  try {
    const authenticated =
      await isAdminAuthenticated()

    if (!authenticated) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
        },
        {
          status: 401,
        }
      )
    }

    const body = await request.json()

    const {
      type,
    } = body

    // =============================================
    // UPDATE CATEGORY
    // =============================================

    if (type === 'category') {
      const id =
        typeof body.id === 'string'
          ? body.id.trim()
          : ''

      const title =
        typeof body.title === 'string'
          ? body.title.trim()
          : ''

      const blurb =
        typeof body.blurb === 'string'
          ? body.blurb.trim()
          : ''

      const isVisible =
        Number(body.isVisible) === 0
          ? 0
          : 1

      if (!id || !title || !blurb) {
        return NextResponse.json(
          {
            error:
              'Category title and description are required.',
          },
          {
            status: 400,
          }
        )
      }

      // Check category exists
      const {
        data: existingCategory,
        error: existingError,
      } = await db
        .from('menu_categories')
        .select('id')
        .eq('id', id)
        .maybeSingle()

      if (existingError) {
        throw existingError
      }

      if (!existingCategory) {
        return NextResponse.json(
          {
            error:
              'Category not found.',
          },
          {
            status: 404,
          }
        )
      }

      const { error: updateError } =
        await db
          .from('menu_categories')
          .update({
            title,
            blurb,
            is_visible: isVisible,
          })
          .eq('id', id)

      if (updateError) {
        throw updateError
      }

      return NextResponse.json({
        success: true,
      })
    }

    // =============================================
    // UPDATE ITEM
    // =============================================

    if (type === 'item') {
      const id =
        Number(body.id)

      const categoryId =
        typeof body.categoryId === 'string'
          ? body.categoryId.trim()
          : ''

      const name =
        typeof body.name === 'string'
          ? body.name.trim()
          : ''

      const description =
        typeof body.description === 'string'
          ? body.description.trim()
          : ''

      const price =
        typeof body.price === 'string'
          ? body.price.trim()
          : ''

      const image =
        typeof body.image === 'string' &&
        body.image.trim()
          ? body.image.trim()
          : null

      const tag =
        typeof body.tag === 'string' &&
        body.tag.trim()
          ? body.tag.trim()
          : null

      const isAvailable =
        Number(body.isAvailable) === 0
          ? 0
          : 1

      if (
        !id ||
        !categoryId ||
        !name ||
        !description ||
        !price
      ) {
        return NextResponse.json(
          {
            error:
              'Category, name, description and price are required.',
          },
          {
            status: 400,
          }
        )
      }

      // Check category
      const {
        data: category,
        error: categoryError,
      } = await db
        .from('menu_categories')
        .select('id')
        .eq('id', categoryId)
        .maybeSingle()

      if (categoryError) {
        throw categoryError
      }

      if (!category) {
        return NextResponse.json(
          {
            error:
              'Selected category does not exist.',
          },
          {
            status: 400,
          }
        )
      }

      // Check item exists
      const {
        data: existingItem,
        error: existingError,
      } = await db
        .from('menu_items')
        .select('id')
        .eq('id', id)
        .maybeSingle()

      if (existingError) {
        throw existingError
      }

      if (!existingItem) {
        return NextResponse.json(
          {
            error:
              'Menu item not found.',
          },
          {
            status: 404,
          }
        )
      }

      const { error: updateError } =
        await db
          .from('menu_items')
          .update({
            category_id: categoryId,
            name,
            description,
            price,
            image,
            tag,
            is_available: isAvailable,
          })
          .eq('id', id)

      if (updateError) {
        throw updateError
      }

      return NextResponse.json({
        success: true,
      })
    }

    return NextResponse.json(
      {
        error:
          'Invalid menu type.',
      },
      {
        status: 400,
      }
    )
  } catch (error) {
    console.error(
      'PATCH /api/menu error:',
      error
    )

    return NextResponse.json(
      {
        error:
          'Failed to update menu entry.',
      },
      {
        status: 500,
      }
    )
  }
}

// ---------------------------------------------
// DELETE
// ---------------------------------------------

export async function DELETE(
  request: Request
) {
  try {
    const authenticated =
      await isAdminAuthenticated()

    if (!authenticated) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
        },
        {
          status: 401,
        }
      )
    }

    const { searchParams } =
      new URL(request.url)

    const type =
      searchParams.get('type')

    const id =
      searchParams.get('id')

    if (!type || !id) {
      return NextResponse.json(
        {
          error:
            'Type and ID are required.',
        },
        {
          status: 400,
        }
      )
    }

    // =============================================
    // DELETE ITEM
    // =============================================

    if (type === 'item') {
      const itemId =
        Number(id)

      if (!itemId) {
        return NextResponse.json(
          {
            error:
              'Invalid item ID.',
          },
          {
            status: 400,
          }
        )
      }

      const {
        data: deletedItem,
        error: deleteError,
      } = await db
        .from('menu_items')
        .delete()
        .eq('id', itemId)
        .select('id')
        .maybeSingle()

      if (deleteError) {
        throw deleteError
      }

      if (!deletedItem) {
        return NextResponse.json(
          {
            error:
              'Menu item not found.',
          },
          {
            status: 404,
          }
        )
      }

      return NextResponse.json({
        success: true,
      })
    }

    // =============================================
    // DELETE CATEGORY
    // =============================================

    if (type === 'category') {
      const categoryId =
        id.trim()

      if (!categoryId) {
        return NextResponse.json(
          {
            error:
              'Invalid category ID.',
          },
          {
            status: 400,
          }
        )
      }

      // Delete items first.
      // This mirrors the old SQLite transaction.
      const {
        error: itemsDeleteError,
      } = await db
        .from('menu_items')
        .delete()
        .eq(
          'category_id',
          categoryId
        )

      if (itemsDeleteError) {
        throw itemsDeleteError
      }

      const {
        data: deletedCategory,
        error: categoryDeleteError,
      } = await db
        .from('menu_categories')
        .delete()
        .eq('id', categoryId)
        .select('id')
        .maybeSingle()

      if (categoryDeleteError) {
        throw categoryDeleteError
      }

      if (!deletedCategory) {
        return NextResponse.json(
          {
            error:
              'Category not found.',
          },
          {
            status: 404,
          }
        )
      }

      return NextResponse.json({
        success: true,
      })
    }

    return NextResponse.json(
      {
        error:
          'Invalid menu type.',
      },
      {
        status: 400,
      }
    )
  } catch (error) {
    console.error(
      'DELETE /api/menu error:',
      error
    )

    return NextResponse.json(
      {
        error:
          'Failed to delete menu entry.',
      },
      {
        status: 500,
      }
    )
  }
}