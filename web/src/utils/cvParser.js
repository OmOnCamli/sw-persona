/**
 * @fileoverview CV text parser utility
 * Extracts email and phone numbers from CV text content using regex patterns.
 */

/**
 * @typedef {Object} ParsedCVInfo
 * @property {string} name - Extracted name
 * @property {string} email - Extracted email address
 * @property {string} phone - Extracted phone number
 * @property {boolean} hasData - Whether any data was extracted
 */

const NAME_REGEX = /(?:ad[\s-]*soyadı?|isim|name)[\s:]*([A-Za-zÇÖĞÜŞİçöğüşı]+(?:\s+[A-Za-zÇÖĞÜŞİçöğüşı]+){1,3})/i
const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g
const PHONE_REGEX =
  /(?:(?:\+|00)90[\s\-\.]?)?(?:0[\s\-\.]?)?\(?5\d{2}\)?[\s\-\.]?\d{3}[\s\-\.]?\d{2}[\s\-\.]?\d{2}\b/g

/**
 * Extracts contact information from CV text
 * @param {string} text - Raw text content from CV
 * @returns {ParsedCVInfo}
 */
export function parseCV(text) {
  if (!text || typeof text !== 'string') {
    return { name: '', email: '', phone: '', hasData: false }
  }

  const nameMatch = text.match(NAME_REGEX)
  const emails = text.match(EMAIL_REGEX) || []
  const phones = text.match(PHONE_REGEX) || []

  // Özel karakterleri veya fazladan boşlukları temizleyerek ilk harfleri büyütelim (İsim için)
  let name = ''
  if (nameMatch && nameMatch[1]) {
    name = nameMatch[1].trim().split(/\s+/).map(word => 
      word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1).toLocaleLowerCase('tr-TR')
    ).join(' ')
  }

  const email = emails[0] || ''
  const phone = phones[0] ? normalizePhone(phones[0]) : ''

  return {
    name,
    email,
    phone,
    hasData: !!(name || email || phone),
  }
}

/**
 * Normalize phone number to a cleaner format
 * @param {string} raw
 * @returns {string}
 */
function normalizePhone(raw) {
  // Remove extra spaces and standardize
  return raw.replace(/[\s.\-]/g, ' ').trim()
}

/**
 * Read text file content using FileReader API
 * @param {File} file
 * @returns {Promise<string>}
 */
export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = () => reject(new Error('Dosya okunamadı'))
    reader.readAsText(file, 'UTF-8')
  })
}

/**
 * Format file size for display
 * @param {number} bytes
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
