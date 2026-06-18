const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

/** Returns an optimized Cloudinary image URL, or null if not configured. */
export function cloudinaryUrl(
  publicId: string,
  options: { width?: number; height?: number; quality?: string } = {},
): string | null {
  if (!CLOUD_NAME || CLOUD_NAME === 'your_cloud_name') return null

  const transforms: string[] = ['f_auto', 'c_fill']
  if (options.width)   transforms.push(`w_${options.width}`)
  if (options.height)  transforms.push(`h_${options.height}`)
  if (options.quality) transforms.push(`q_${options.quality}`)
  else                 transforms.push('q_auto')

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms.join(',')}/${publicId}`
}

/**
 * Returns a Cloudinary raw file URL (for PDFs).
 * publicId: the path in Cloudinary, e.g. "portfolio/pdfs/propiq-case-study"
 */
export function cloudinaryRawUrl(publicId: string): string | null {
  if (!CLOUD_NAME || CLOUD_NAME === 'your_cloud_name') return null
  return `https://res.cloudinary.com/${CLOUD_NAME}/raw/upload/${publicId}`
}
