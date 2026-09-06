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
    const categories = db
      .prepare(`
        SELECT
          id,
          title,
          blurb,
          sort_order,
          is_visible
        FROM menu_categories
        ORDER BY sort_order ASC
      `)
      .all() as {
        id: string
        title: string
        blurb: string
        sort_order: number
        is_visible: number
      }[]

    const items = db
      .prepare(`
        SELECT
          id,
          category_id,
          name,
          description,
          price,
          image,
          tag,
          sort_order,
          is_available
        FROM menu_items
        ORDER BY sort_order ASC
      `)
      .all() as {
        id: number
        category_id: string
        name: string
        description: string
        price: string
        image: string | null
        tag: string | null
        sort_order: number
        is_available: number
      }[]

    // ---------------------------------------------
    // Full menu for admin
    // ---------------------------------------------

    const adminMenu = categories.map(
      (category) => ({
        ...category,

        items: items.filter(
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
      categories
        .filter(
          (category) =>
            category.is_visible === 1
        )
        .map((category) => ({
          id: category.id,
          title: category.title,
          blurb: category.blurb,

          items: items
            .filter(
              (item) =>
                item.category_id ===
                  category.id &&
                item.is_available === 1
            )
            .map((item) => ({
              name: item.name,
              description:
                item.description,
              price: item.price,
              image: item.image || undefined,
              tag: item.tag || undefined,
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

      const existing =
        db
          .prepare(`
            SELECT id
            FROM menu_categories
            WHERE id = ?
          `)
          .get(id)

      if (existing) {
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

      const sortResult =
        db
          .prepare(`
            SELECT
              COALESCE(
                MAX(sort_order),
                -1
              ) + 1 AS next_sort
            FROM menu_categories
          `)
          .get() as {
            next_sort: number
          }

      db.prepare(`
        INSERT INTO menu_categories (
          id,
          title,
          blurb,
          sort_order,
          is_visible
        )
        VALUES (?, ?, ?, ?, 1)
      `).run(
        id,
        title,
        blurb,
        sortResult.next_sort
      )

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

      const category =
        db
          .prepare(`
            SELECT id
            FROM menu_categories
            WHERE id = ?
          `)
          .get(categoryId)

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

      const sortResult =
        db
          .prepare(`
            SELECT
              COALESCE(
                MAX(sort_order),
                -1
              ) + 1 AS next_sort
            FROM menu_items
            WHERE category_id = ?
          `)
          .get(categoryId) as {
            next_sort: number
          }

      const result =
        db.prepare(`
          INSERT INTO menu_items (
            category_id,
            name,
            description,
            price,
            image,
            tag,
            sort_order,
            is_available
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, 1)
        `).run(
          categoryId,
          name,
          description,
          price,
          image,
          tag,
          sortResult.next_sort
        )

      return NextResponse.json({
        success: true,
        id: result.lastInsertRowid,
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
    //
    // IMPORTANT:
    // We validate ONLY category fields here.
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

      const existing =
        db
          .prepare(`
            SELECT id
            FROM menu_categories
            WHERE id = ?
          `)
          .get(id)

      if (!existing) {
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

      db.prepare(`
        UPDATE menu_categories
        SET
          title = ?,
          blurb = ?,
          is_visible = ?
        WHERE id = ?
      `).run(
        title,
        blurb,
        isVisible,
        id
      )

      return NextResponse.json({
        success: true,
      })
    }

    // =============================================
    // UPDATE ITEM
    //
    // IMPORTANT:
    // We validate item fields ONLY here.
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

      const category =
        db
          .prepare(`
            SELECT id
            FROM menu_categories
            WHERE id = ?
          `)
          .get(categoryId)

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

      const existingItem =
        db
          .prepare(`
            SELECT id
            FROM menu_items
            WHERE id = ?
          `)
          .get(id)

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

      db.prepare(`
        UPDATE menu_items
        SET
          category_id = ?,
          name = ?,
          description = ?,
          price = ?,
          image = ?,
          tag = ?,
          is_available = ?
        WHERE id = ?
      `).run(
        categoryId,
        name,
        description,
        price,
        image,
        tag,
        isAvailable,
        id
      )

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

      const result =
        db
          .prepare(`
            DELETE FROM menu_items
            WHERE id = ?
          `)
          .run(itemId)

      if (result.changes === 0) {
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

      const deleteCategory =
        db.transaction(() => {
          db.prepare(`
            DELETE FROM menu_items
            WHERE category_id = ?
          `).run(categoryId)

          return db
            .prepare(`
              DELETE FROM menu_categories
              WHERE id = ?
            `)
            .run(categoryId)
        })

      const result =
        deleteCategory()

      if (result.changes === 0) {
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