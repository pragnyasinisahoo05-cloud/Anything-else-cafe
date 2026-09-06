// app/api/menu/upload/route.ts

import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'
import { isAdminAuthenticated } from '@/lib/admin-auth'

export const runtime = 'nodejs'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
])

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
}

export async function POST(request: Request) {
  try {
    // --------------------------------
    // Admin authentication
    // --------------------------------

    const authenticated = await isAdminAuthenticated()

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

    // --------------------------------
    // Read form data
    // --------------------------------

    const formData = await request.formData()

    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: 'No image file was provided.',
        },
        {
          status: 400,
        }
      )
    }

    // --------------------------------
    // Validate file type
    // --------------------------------

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          error:
            'Invalid image type. Please use JPG, PNG, WEBP, or GIF.',
        },
        {
          status: 400,
        }
      )
    }

    // --------------------------------
    // Validate file size
    // --------------------------------

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error:
            'Image is too large. Maximum allowed size is 5 MB.',
        },
        {
          status: 400,
        }
      )
    }

    if (file.size === 0) {
      return NextResponse.json(
        {
          error: 'The selected image is empty.',
        },
        {
          status: 400,
        }
      )
    }

    // --------------------------------
    // Create upload directory
    // --------------------------------

    const uploadDirectory = path.join(
      process.cwd(),
      'public',
      'images',
      'menu'
    )

    await fs.mkdir(uploadDirectory, {
      recursive: true,
    })

    // --------------------------------
    // Generate safe unique filename
    // --------------------------------

    const extension =
      EXTENSIONS[file.type] || '.jpg'

    const randomName =
      crypto.randomBytes(16).toString('hex')

    const filename =
      `menu-${Date.now()}-${randomName}${extension}`

    const filePath = path.join(
      uploadDirectory,
      filename
    )

    // --------------------------------
    // Write file
    // --------------------------------

    const buffer = Buffer.from(
      await file.arrayBuffer()
    )

    await fs.writeFile(
      filePath,
      buffer
    )

    // --------------------------------
    // Public image URL
    // --------------------------------

    const imageUrl =
      `/images/menu/${filename}`

    return NextResponse.json({
      success: true,
      imageUrl,
    })
  } catch (error) {
    console.error(
      'Menu image upload error:',
      error
    )

    return NextResponse.json(
      {
        error:
          'Something went wrong while uploading the image.',
      },
      {
        status: 500,
      }
    )
  }
}