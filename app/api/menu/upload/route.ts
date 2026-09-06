import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import {
  isAdminAuthenticated,
} from '@/lib/admin-auth'

export const runtime = 'nodejs'

cloudinary.config({
  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME,
  api_key:
    process.env.CLOUDINARY_API_KEY,
  api_secret:
    process.env.CLOUDINARY_API_SECRET,
})

const MAX_FILE_SIZE =
  5 * 1024 * 1024

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]

export async function POST(
  request: Request
) {
  try {
    const authenticated =
      await isAdminAuthenticated()

    if (!authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized.' },
        { status: 401 }
      )
    }

    const formData =
      await request.formData()

    const file =
      formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error:
            'Please select an image.',
        },
        { status: 400 }
      )
    }

    if (
      !ALLOWED_TYPES.includes(
        file.type
      )
    ) {
      return NextResponse.json(
        {
          error:
            'Only JPEG, PNG, WEBP and GIF images are allowed.',
        },
        { status: 400 }
      )
    }

    if (
      file.size > MAX_FILE_SIZE
    ) {
      return NextResponse.json(
        {
          error:
            'Image must be smaller than 5MB.',
        },
        { status: 400 }
      )
    }

    const buffer =
      Buffer.from(
        await file.arrayBuffer()
      )

    const uploadResult =
      await new Promise<{
        secure_url: string
        public_id: string
      }>((resolve, reject) => {
        const uploadStream =
          cloudinary.uploader.upload_stream(
            {
              folder:
                'anything-else-cafe/menu',
              resource_type: 'image',
            },
            (error, result) => {
              if (error) {
                reject(error)
                return
              }

              if (!result) {
                reject(
                  new Error(
                    'Cloudinary upload failed.'
                  )
                )
                return
              }

              resolve({
                secure_url:
                  result.secure_url,
                public_id:
                  result.public_id,
              })
            }
          )

        uploadStream.end(buffer)
      })

    return NextResponse.json({
      success: true,
      imageUrl:
        uploadResult.secure_url,
      publicId:
        uploadResult.public_id,
    })
  } catch (error) {
    console.error(
      'Cloudinary upload error:',
      error
    )

    return NextResponse.json(
      {
        error:
          'Unable to upload image.',
      },
      { status: 500 }
    )
  }
}