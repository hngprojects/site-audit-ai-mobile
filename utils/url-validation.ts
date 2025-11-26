export interface UrlValidationResult {
  isValid: boolean;
  error: string;
}

/**
 * Normalizes a URL by ensuring it has a proper protocol
 * @param url - The URL to normalize
 * @returns The normalized URL with https:// protocol
 */
export const normalizeUrl = (url: string): string => {
  if (!url || typeof url !== 'string') {
    throw new Error('URL is required');
  }

  let normalized = url.trim().toLowerCase();

  // Add protocol if missing
  if (normalized.startsWith('www.')) {
    normalized = `https://${normalized}`;
  } else if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = `https://${normalized}`;
  }

  // Convert http to https for security
  if (normalized.startsWith('http://')) {
    normalized = normalized.replace('http://', 'https://');
  }

  return normalized;
};

/**
 * Validates a website URL with permissive input acceptance
 * @param url - The URL to validate
 * @returns Validation result with isValid flag and error message
 */
export const validateWebsiteUrl = (url: string): UrlValidationResult => {
  if (!url || url.trim() === '') {
    return { isValid: false, error: 'Please enter a website URL' };
  }

  const trimmedUrl = url.trim();

  // Allow various URL formats:
  // - https://example.com
  // - http://example.com
  // - www.example.com
  // - example.com
  const hasValidStart = trimmedUrl.startsWith('https://') ||
                       trimmedUrl.startsWith('http://') ||
                       trimmedUrl.startsWith('www.') ||
                       trimmedUrl.includes('.'); // Allow bare domains

  if (!hasValidStart) {
    return { isValid: false, error: 'Please enter a valid website URL' };
  }

  // Extract domain part for validation
  let domain = trimmedUrl;

  // Remove protocol
  if (domain.startsWith('https://')) {
    domain = domain.substring(8);
  } else if (domain.startsWith('http://')) {
    domain = domain.substring(7);
  }

  // Remove www. if present
  if (domain.startsWith('www.')) {
    domain = domain.substring(4);
  }

  // Check if domain is not empty
  if (!domain || domain.trim() === '') {
    return { isValid: false, error: 'Please enter a valid domain name' };
  }

  // Remove path/query/fragment for domain validation
  const domainWithoutPath = domain.split('/')[0];
  const domainWithoutQuery = domainWithoutPath.split('?')[0];
  const cleanDomain = domainWithoutQuery.split('#')[0];

  // Check for valid domain format (must have at least one dot and valid TLD)
  // Domain should have format: subdomain.domain.tld or domain.tld
  const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

  if (!domainRegex.test(cleanDomain)) {
    return { isValid: false, error: 'Please enter a valid domain name (e.g., example.com)' };
  }

  // Check for valid TLD (2-6 characters)
  const tldMatch = cleanDomain.match(/\.([a-zA-Z]{2,6})$/);
  if (!tldMatch) {
    return { isValid: false, error: 'URL must have a valid domain extension (e.g., .com, .org)' };
  }

  return { isValid: true, error: '' };
};

