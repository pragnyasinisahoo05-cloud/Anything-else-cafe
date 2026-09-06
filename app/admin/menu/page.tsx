'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

type MenuItem = {
  id: number
  category_id: string
  name: string
  description: string
  price: string
  image: string | null
  tag: string | null
  sort_order: number
  is_available: number
}

type MenuCategory = {
  id: string
  title: string
  blurb: string
  sort_order: number
  is_visible: number
  items: MenuItem[]
}

type ModalType = 'category' | 'item' | null

export default function AdminMenuPage() {
  const [menu, setMenu] = useState<MenuCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [modal, setModal] =
    useState<ModalType>(null)

  const [editingCategory, setEditingCategory] =
    useState<MenuCategory | null>(null)

  const [editingItem, setEditingItem] =
    useState<MenuItem | null>(null)

  const imageInputRef =
    useRef<HTMLInputElement | null>(null)

  // --------------------------------
  // Category form
  // --------------------------------

  const [categoryTitle, setCategoryTitle] =
    useState('')

  const [categoryBlurb, setCategoryBlurb] =
    useState('')

  // --------------------------------
  // Item form
  // --------------------------------

  const [itemCategoryId, setItemCategoryId] =
    useState('')

  const [itemName, setItemName] =
    useState('')

  const [itemDescription, setItemDescription] =
    useState('')

  const [itemPrice, setItemPrice] =
    useState('')

  const [itemImage, setItemImage] =
    useState('')

  const [itemTag, setItemTag] =
    useState('')

  const [selectedImageName, setSelectedImageName] =
    useState('')

  const [imagePreview, setImagePreview] =
    useState('')

  // --------------------------------
  // Fetch menu
  // --------------------------------

  async function loadMenu() {
    try {
      setLoading(true)
      setError('')

      const response = await fetch('/api/menu', {
        cache: 'no-store',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to load menu.'
        )
      }

      setMenu(data.adminMenu ?? [])
    } catch (error) {
      console.error(error)

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to load menu.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMenu()
  }, [])

  // --------------------------------
  // Helpers
  // --------------------------------

  function clearMessages() {
    setError('')
    setSuccess('')
  }

  function clearImageSelection() {
  setSelectedImageName('')
  setImagePreview('')
  setItemImage('')

  if (imageInputRef.current) {
    imageInputRef.current.value = ''
  }
}

  function closeModal() {
    setModal(null)

    setEditingCategory(null)
    setEditingItem(null)

    setCategoryTitle('')
    setCategoryBlurb('')

    setItemCategoryId('')
    setItemName('')
    setItemDescription('')
    setItemPrice('')
    setItemImage('')
    setItemTag('')

    clearImageSelection()
  }

  // --------------------------------
  // Image selection
  // --------------------------------

  async function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0]

    if (!file) {
      return
    }

    clearMessages()

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ]

    if (!allowedTypes.includes(file.type)) {
      setError(
        'Please choose a JPG, PNG, WEBP, or GIF image.'
      )

      clearImageSelection()
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        'Image must be smaller than 5 MB.'
      )

      clearImageSelection()
      return
    }

    setSelectedImageName(file.name)

    const previewUrl =
      URL.createObjectURL(file)

    setImagePreview(previewUrl)

    try {
      setUploading(true)

      const formData = new FormData()

      formData.append(
        'file',
        file
      )

      const response = await fetch(
        '/api/menu/upload',
        {
          method: 'POST',
          body: formData,
        }
      )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to upload image.'
        )
      }

      setItemImage(data.imageUrl)

      setSuccess(
        'Image uploaded successfully.'
      )
    } catch (error) {
      console.error(error)

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to upload image.'
      )

      setItemImage('')
      setImagePreview('')
      setSelectedImageName('')

      if (imageInputRef.current) {
        imageInputRef.current.value = ''
      }
    } finally {
      setUploading(false)
    }
  }

  // --------------------------------
  // Add category
  // --------------------------------

  function openAddCategory() {
    clearMessages()

    setEditingCategory(null)

    setCategoryTitle('')
    setCategoryBlurb('')

    setModal('category')
  }

  // --------------------------------
  // Edit category
  // --------------------------------

  function openEditCategory(
    category: MenuCategory
  ) {
    clearMessages()

    setEditingCategory(category)

    setCategoryTitle(
      category.title
    )

    setCategoryBlurb(
      category.blurb
    )

    setModal('category')
  }

  // --------------------------------
  // Save category
  // --------------------------------

  async function saveCategory() {
    if (!categoryTitle.trim()) {
      setError(
        'Category title is required.'
      )
      return
    }

    if (!categoryBlurb.trim()) {
      setError(
        'Category description is required.'
      )
      return
    }

    try {
      setSaving(true)
      clearMessages()

      const editing =
        Boolean(editingCategory)

      const response =
        await fetch('/api/menu', {
          method: editing
            ? 'PATCH'
            : 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify(
            editing
              ? {
                  type: 'category',
                  id:
                    editingCategory?.id,
                  title:
                    categoryTitle.trim(),
                  blurb:
                    categoryBlurb.trim(),
                  isVisible:
                    editingCategory?.is_visible ??
                    1,
                }
              : {
                  type: 'category',
                  title:
                    categoryTitle.trim(),
                  blurb:
                    categoryBlurb.trim(),
                }
          ),
        })

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to save category.'
        )
      }

      await loadMenu()

      closeModal()

      setSuccess(
        editing
          ? 'Category updated successfully.'
          : 'Category added successfully.'
      )
    } catch (error) {
      console.error(error)

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to save category.'
      )
    } finally {
      setSaving(false)
    }
  }

  // --------------------------------
  // Toggle category
  // --------------------------------

  async function toggleCategory(
    category: MenuCategory
  ) {
    try {
      clearMessages()

      const response =
        await fetch('/api/menu', {
          method: 'PATCH',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            type: 'category',
            id: category.id,
            title: category.title,
            blurb: category.blurb,
            isVisible:
              category.is_visible
                ? 0
                : 1,
          }),
        })

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to update category.'
        )
      }

      await loadMenu()

      setSuccess(
        category.is_visible
          ? 'Category hidden from customers.'
          : 'Category is now visible to customers.'
      )
    } catch (error) {
      console.error(error)

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to update category.'
      )
    }
  }

  // --------------------------------
  // Delete category
  // --------------------------------

  async function deleteCategory(
    category: MenuCategory
  ) {
    const confirmed =
      window.confirm(
        `Delete "${category.title}" and all items inside it? This cannot be undone.`
      )

    if (!confirmed) {
      return
    }

    try {
      clearMessages()

      const response =
        await fetch(
          `/api/menu?type=category&id=${encodeURIComponent(
            category.id
          )}`,
          {
            method: 'DELETE',
          }
        )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to delete category.'
        )
      }

      await loadMenu()

      setSuccess(
        'Category deleted successfully.'
      )
    } catch (error) {
      console.error(error)

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to delete category.'
      )
    }
  }

  // --------------------------------
  // Add item
  // --------------------------------

  function openAddItem(
    categoryId?: string
  ) {
    clearMessages()

    setEditingItem(null)

    setItemCategoryId(
      categoryId ||
        menu[0]?.id ||
        ''
    )

    setItemName('')
    setItemDescription('')
    setItemPrice('')
    setItemImage('')
    setItemTag('')

    clearImageSelection()

    setModal('item')
  }

  // --------------------------------
  // Edit item
  // --------------------------------

  function openEditItem(
    item: MenuItem
  ) {
    clearMessages()

    setEditingItem(item)

    setItemCategoryId(
      item.category_id
    )

    setItemName(item.name)

    setItemDescription(
      item.description
    )

    setItemPrice(item.price)

    setItemImage(
      item.image || ''
    )

    setItemTag(
      item.tag || ''
    )

    setSelectedImageName(
      item.image
        ? 'Current image'
        : ''
    )

    setImagePreview(
      item.image || ''
    )

    setModal('item')
  }

  // --------------------------------
  // Save item
  // --------------------------------

  async function saveItem() {
    if (!itemCategoryId) {
      setError(
        'Please select a category.'
      )
      return
    }

    if (!itemName.trim()) {
      setError(
        'Item name is required.'
      )
      return
    }

    if (!itemDescription.trim()) {
      setError(
        'Item description is required.'
      )
      return
    }

    if (!itemPrice.trim()) {
      setError(
        'Item price is required.'
      )
      return
    }

    if (uploading) {
      setError(
        'Please wait for the image to finish uploading.'
      )
      return
    }

    try {
      setSaving(true)
      clearMessages()

      const editing =
        Boolean(editingItem)

      const response =
        await fetch('/api/menu', {
          method: editing
            ? 'PATCH'
            : 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify(
            editing
              ? {
                  type: 'item',
                  id:
                    editingItem?.id,
                  categoryId:
                    itemCategoryId,
                  name:
                    itemName.trim(),
                  description:
                    itemDescription.trim(),
                  price:
                    itemPrice.trim(),
                  image:
                    itemImage || null,
                  tag:
                    itemTag.trim() ||
                    null,
                  isAvailable:
                    editingItem?.is_available ??
                    1,
                }
              : {
                  type: 'item',
                  categoryId:
                    itemCategoryId,
                  name:
                    itemName.trim(),
                  description:
                    itemDescription.trim(),
                  price:
                    itemPrice.trim(),
                  image:
                    itemImage || null,
                  tag:
                    itemTag.trim() ||
                    null,
                }
          ),
        })

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to save item.'
        )
      }

      await loadMenu()

      closeModal()

      setSuccess(
        editing
          ? 'Menu item updated successfully.'
          : 'Menu item added successfully.'
      )
    } catch (error) {
      console.error(error)

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to save item.'
      )
    } finally {
      setSaving(false)
    }
  }

  // --------------------------------
  // Toggle item
  // --------------------------------

  async function toggleItem(
    item: MenuItem
  ) {
    try {
      clearMessages()

      const response =
        await fetch('/api/menu', {
          method: 'PATCH',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            type: 'item',
            id: item.id,
            categoryId:
              item.category_id,
            name: item.name,
            description:
              item.description,
            price: item.price,
            image: item.image,
            tag: item.tag,
            isAvailable:
              item.is_available
                ? 0
                : 1,
          }),
        })

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to update item.'
        )
      }

      await loadMenu()

      setSuccess(
        item.is_available
          ? `${item.name} is now hidden from customers.`
          : `${item.name} is now available to customers.`
      )
    } catch (error) {
      console.error(error)

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to update item.'
      )
    }
  }

  // --------------------------------
  // Delete item
  // --------------------------------

  async function deleteItem(
    item: MenuItem
  ) {
    const confirmed =
      window.confirm(
        `Delete "${item.name}"? This cannot be undone.`
      )

    if (!confirmed) {
      return
    }

    try {
      clearMessages()

      const response =
        await fetch(
          `/api/menu?type=item&id=${item.id}`,
          {
            method: 'DELETE',
          }
        )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Failed to delete item.'
        )
      }

      await loadMenu()

      setSuccess(
        'Menu item deleted successfully.'
      )
    } catch (error) {
      console.error(error)

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to delete item.'
      )
    }
  }

  // --------------------------------
  // Loading
  // --------------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-background px-6 py-10">

        <div className="mx-auto max-w-7xl">

          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="h-4 w-32 animate-pulse rounded bg-secondary" />

              <div className="mt-4 h-10 w-64 animate-pulse rounded bg-secondary" />

              <div className="mt-3 h-5 w-80 animate-pulse rounded bg-secondary" />

            </div>

            <div className="h-11 w-36 animate-pulse rounded-full bg-secondary" />

          </div>

          <div className="space-y-8">

            {[1, 2, 3].map(
              (section) => (
                <div
                  key={section}
                  className="rounded-3xl bg-card p-6"
                >
                  <div className="h-7 w-48 animate-pulse rounded bg-secondary" />

                  <div className="mt-3 h-4 w-72 animate-pulse rounded bg-secondary" />

                  <div className="mt-8 space-y-4">

                    {[1, 2, 3].map(
                      (item) => (
                        <div
                          key={item}
                          className="h-24 animate-pulse rounded-2xl bg-secondary"
                        />
                      )
                    )}

                  </div>
                </div>
              )
            )}

          </div>

        </div>

      </main>
    )
  }

  // --------------------------------
  // Page
  // --------------------------------

  return (
    <main className="min-h-screen bg-background px-6 py-10">

      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Anything Else
            </p>

            <h1 className="mt-2 font-serif text-4xl text-foreground md:text-5xl">
              Manage Menu
            </h1>

            <p className="mt-2 max-w-xl text-muted-foreground">
              Add, edit, hide, or remove categories
              and menu items. Changes here appear on
              the customer menu.
            </p>

          </div>

          <div className="flex flex-wrap gap-3">

            <Link
              href="/admin/reservations"
              className="rounded-full border border-border px-5 py-2.5 text-sm transition-colors hover:bg-muted"
            >
              Reservations
            </Link>

            <Link
              href="/menu"
              target="_blank"
              className="rounded-full border border-border px-5 py-2.5 text-sm transition-colors hover:bg-muted"
            >
              View Menu
            </Link>

            <button
              type="button"
              onClick={openAddCategory}
              className="rounded-full bg-foreground px-5 py-2.5 text-sm text-background transition-opacity hover:opacity-85"
            >
              + Add Category
            </button>

          </div>

        </div>

        {/* Messages */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Empty */}

        {menu.length === 0 ? (

          <div className="rounded-3xl bg-card p-12 text-center">

            <h2 className="font-serif text-3xl text-foreground">
              No menu categories yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Create your first category and then add
              items to it.
            </p>

            <button
              type="button"
              onClick={openAddCategory}
              className="mt-6 rounded-full bg-foreground px-6 py-3 text-sm text-background transition-opacity hover:opacity-85"
            >
              + Add Your First Category
            </button>

          </div>

        ) : (

          <div className="space-y-8">

            {menu.map(
              (category) => (

                <section
                  key={category.id}
                  className={`rounded-3xl bg-card p-6 md:p-8 ${
                    !category.is_visible
                      ? 'opacity-70'
                      : ''
                  }`}
                >

                  {/* Category Header */}

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-3">

                        <h2 className="font-serif text-3xl text-foreground">
                          {category.title}
                        </h2>

                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wider ${
                            category.is_visible
                              ? 'bg-green-100 text-green-700'
                              : 'bg-secondary text-muted-foreground'
                          }`}
                        >
                          {category.is_visible
                            ? 'Visible'
                            : 'Hidden'}
                        </span>

                      </div>

                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                        {category.blurb}
                      </p>

                    </div>

                    <div className="flex flex-wrap gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          openAddItem(
                            category.id
                          )
                        }
                        className="rounded-full bg-foreground px-4 py-2 text-sm text-background transition-opacity hover:opacity-85"
                      >
                        + Add Item
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openEditCategory(
                            category
                          )
                        }
                        className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          toggleCategory(
                            category
                          )
                        }
                        className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
                      >
                        {category.is_visible
                          ? 'Hide'
                          : 'Show'}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteCategory(
                            category
                          )
                        }
                        className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                  {/* Items */}

                  <div className="mt-8">

                    {category.items.length === 0 ? (

                      <div className="rounded-2xl border border-dashed border-border p-8 text-center">

                        <p className="text-sm text-muted-foreground">
                          No items in this category yet.
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            openAddItem(
                              category.id
                            )
                          }
                          className="mt-4 rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
                        >
                          + Add Item
                        </button>

                      </div>

                    ) : (

                      <div className="divide-y divide-border rounded-2xl border border-border">

                        {category.items.map(
                          (item) => (

                            <div
                              key={item.id}
                              className={`flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between ${
                                !item.is_available
                                  ? 'opacity-60'
                                  : ''
                              }`}
                            >

                              {/* Item Info */}

                              <div className="flex min-w-0 flex-1 gap-4">

                                {item.image ? (

                                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-secondary">

                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="h-full w-full object-cover"
                                    />

                                  </div>

                                ) : (

                                  <div className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-secondary text-xs text-muted-foreground sm:flex">
                                    No image
                                  </div>

                                )}

                                <div className="min-w-0">

                                  <div className="flex flex-wrap items-center gap-3">

                                    <h3 className="font-serif text-xl text-foreground">
                                      {item.name}
                                    </h3>

                                    {item.tag && (
                                      <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[10px] uppercase tracking-wider text-accent-foreground/80">
                                        {item.tag}
                                      </span>
                                    )}

                                    <span
                                      className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider ${
                                        item.is_available
                                          ? 'bg-green-100 text-green-700'
                                          : 'bg-secondary text-muted-foreground'
                                      }`}
                                    >
                                      {item.is_available
                                        ? 'Available'
                                        : 'Unavailable'}
                                    </span>

                                  </div>

                                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                    {item.description}
                                  </p>

                                  <div className="mt-2 flex items-center gap-3">

                                    <span className="font-serif text-lg text-foreground">
                                      ₹{item.price}
                                    </span>

                                  </div>

                                </div>

                              </div>

                              {/* Actions */}

                              <div className="flex shrink-0 flex-wrap gap-2">

                                <button
                                  type="button"
                                  onClick={() =>
                                    openEditItem(
                                      item
                                    )
                                  }
                                  className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleItem(
                                      item
                                    )
                                  }
                                  className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
                                >
                                  {item.is_available
                                    ? 'Mark Unavailable'
                                    : 'Mark Available'}
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteItem(
                                      item
                                    )
                                  }
                                  className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                                >
                                  Delete
                                </button>

                              </div>

                            </div>

                          )
                        )}

                      </div>

                    )}

                  </div>

                </section>

              )
            )}

          </div>

        )}

      </div>

      {/* ================================== */}
      {/* Modal */}
      {/* ================================== */}

      {modal && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal()
            }
          }}
        >

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-background p-6 shadow-2xl md:p-8">

            {/* Modal Header */}

            <div className="mb-6 flex items-start justify-between gap-5">

              <div>

                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {modal === 'category'
                    ? 'Menu Category'
                    : 'Menu Item'}
                </p>

                <h2 className="mt-2 font-serif text-3xl text-foreground">
                  {modal === 'category'
                    ? editingCategory
                      ? 'Edit Category'
                      : 'Add Category'
                    : editingItem
                      ? 'Edit Item'
                      : 'Add Item'}
                </h2>

              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-lg transition-colors hover:bg-muted"
                aria-label="Close"
              >
                ×
              </button>

            </div>

            {/* Modal Error */}

            {error && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* ================================ */}
            {/* CATEGORY FORM */}
            {/* ================================ */}

            {modal === 'category' && (

              <div className="space-y-5">

                <div>

                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Category title
                  </label>

                  <input
                    type="text"
                    value={categoryTitle}
                    onChange={(event) =>
                      setCategoryTitle(
                        event.target.value
                      )
                    }
                    placeholder="Espresso Bar"
                    className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-foreground"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Description
                  </label>

                  <textarea
                    value={categoryBlurb}
                    onChange={(event) =>
                      setCategoryBlurb(
                        event.target.value
                      )
                    }
                    placeholder="Classic espresso drinks, dialed in daily."
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-foreground"
                  />

                </div>

                <div className="flex justify-end gap-3 pt-2">

                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-full border border-border px-5 py-2.5 text-sm transition-colors hover:bg-muted"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={saveCategory}
                    disabled={saving}
                    className="rounded-full bg-foreground px-5 py-2.5 text-sm text-background transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving
                      ? 'Saving...'
                      : editingCategory
                        ? 'Save Changes'
                        : 'Add Category'}
                  </button>

                </div>

              </div>

            )}

            {/* ================================ */}
            {/* ITEM FORM */}
            {/* ================================ */}

            {modal === 'item' && (

              <div className="space-y-5">

                {/* Category */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Category
                  </label>

                  <select
                    value={itemCategoryId}
                    onChange={(event) =>
                      setItemCategoryId(
                        event.target.value
                      )
                    }
                    className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-foreground"
                  >

                    <option value="">
                      Select a category
                    </option>

                    {menu.map(
                      (category) => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.title}
                        </option>
                      )
                    )}

                  </select>

                </div>

                {/* Name */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Item name
                  </label>

                  <input
                    type="text"
                    value={itemName}
                    onChange={(event) =>
                      setItemName(
                        event.target.value
                      )
                    }
                    placeholder="Caramel Latte"
                    className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-foreground"
                  />

                </div>

                {/* Description */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Description
                  </label>

                  <textarea
                    value={itemDescription}
                    onChange={(event) =>
                      setItemDescription(
                        event.target.value
                      )
                    }
                    placeholder="Silky espresso, steamed milk, and house caramel."
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-foreground"
                  />

                </div>

                {/* Price + Tag */}

                <div className="grid gap-5 sm:grid-cols-2">

                  <div>

                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Price
                    </label>

                    <div className="relative">

                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        ₹
                      </span>

                      <input
                        type="text"
                        value={itemPrice}
                        onChange={(event) =>
                          setItemPrice(
                            event.target.value
                          )
                        }
                        placeholder="180"
                        className="w-full rounded-2xl border border-border bg-background py-3 pl-8 pr-4 text-sm outline-none transition focus:border-foreground"
                      />

                    </div>

                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Tag
                    </label>

                    <input
                      type="text"
                      value={itemTag}
                      onChange={(event) =>
                        setItemTag(
                          event.target.value
                        )
                      }
                      placeholder="Signature"
                      className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-foreground"
                    />

                  </div>

                </div>

                {/* ================================= */}
                {/* IMAGE UPLOAD */}
                {/* ================================= */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Item image
                  </label>

                  <div className="rounded-2xl border border-dashed border-border p-4">

                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={
                        handleImageChange
                      }
                      className="hidden"
                      id="menu-image-upload"
                    />

                    <label
                      htmlFor="menu-image-upload"
                      className="flex cursor-pointer flex-col items-center justify-center rounded-xl bg-secondary/50 px-6 py-8 text-center transition-colors hover:bg-secondary"
                    >

                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-background text-xl">
                        📷
                      </div>

                      <span className="text-sm font-medium text-foreground">
                        {uploading
                          ? 'Uploading image...'
                          : 'Choose an image'}
                      </span>

                      <span className="mt-1 text-xs text-muted-foreground">
                        JPG, PNG, WEBP or GIF · Max 5 MB
                      </span>

                    </label>

                    {/* Preview */}

                    {imagePreview && (
                      <div className="mt-4 overflow-hidden rounded-2xl border border-border">

                        <div className="relative aspect-[16/9] w-full bg-secondary">

                          <img
                            src={imagePreview}
                            alt="Selected menu item"
                            className="h-full w-full object-cover"
                          />

                        </div>

                        <div className="flex items-center justify-between gap-4 p-3">

                          <div className="min-w-0">

                            <p className="truncate text-sm font-medium text-foreground">
                              {selectedImageName}
                            </p>

                            {itemImage && (
                              <p className="mt-1 text-xs text-green-600">
                                Image uploaded ✓
                              </p>
                            )}

                          </div>

                          <button
                            type="button"
                            onClick={
                              clearImageSelection
                            }
                            className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs transition-colors hover:bg-muted"
                          >
                            Remove
                          </button>

                        </div>

                      </div>
                    )}

                  </div>

                </div>

                {/* Buttons */}

                <div className="flex justify-end gap-3 pt-2">

                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-full border border-border px-5 py-2.5 text-sm transition-colors hover:bg-muted"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={saveItem}
                    disabled={
                      saving ||
                      uploading
                    }
                    className="rounded-full bg-foreground px-5 py-2.5 text-sm text-background transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {uploading
                      ? 'Uploading...'
                      : saving
                        ? 'Saving...'
                        : editingItem
                          ? 'Save Changes'
                          : 'Add Item'}
                  </button>

                </div>

              </div>

            )}

          </div>

        </div>

      )}

    </main>
  )
}