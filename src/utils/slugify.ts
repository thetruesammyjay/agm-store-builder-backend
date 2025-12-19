/**
 * AGM Store Builder - Slugify Utility
 * Convert strings to URL-friendly slugs
 */

/**
 * Convert string to slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

/**
 * Generate unique slug with suffix
 */
export function generateUniqueSlug(text: string, suffix?: string): string {
  const baseSlug = slugify(text);
  
  if (suffix) {
    return `${baseSlug}-${suffix}`;
  }
  
  const timestamp = Date.now().toString(36);
  return `${baseSlug}-${timestamp}`;
}

/**
 * Validate slug format
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}