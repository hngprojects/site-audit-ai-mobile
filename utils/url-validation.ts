export interface UrlValidationResult {
  isValid: boolean;
  error: string;
}

/**
 * Normalizes a URL by adding https:// if it starts with www.
 * @param url - The URL to normalize
 * @returns The normalized URL
 */
export const normalizeUrl = (url: string): string => {
  const trimmed = url.trim();
  if (trimmed.startsWith('www.')) {
    return `https://${trimmed}`;
  }
  return trimmed;
};

/**
 * Validates a website URL
 * @param url - The URL to validate
 * @returns Validation result with isValid flag and error message
 */
export const validateWebsiteUrl = (url: string): UrlValidationResult => {
  if (!url || url.trim() === '') {
    return { isValid: false, error: 'Please enter a website URL' };
  }

  const trimmedUrl = url.trim();

  // Check if URL starts with https:// or www.
  const startsWithValid = trimmedUrl.startsWith('https://') || trimmedUrl.startsWith('www.');
  if (!startsWithValid) {
    return { isValid: false, error: 'URL must start with "https://" or "www."' };
  }

  // Remove protocol for domain validation
  let domain = trimmedUrl;
  if (domain.startsWith('https://')) {
    domain = domain.substring(8);
  } else if (domain.startsWith('www.')) {
    domain = domain.substring(4);
  }

  // Check if domain is not empty
  if (!domain || domain.trim() === '') {
    return { isValid: false, error: 'Please enter a valid domain name' };
  }

  // Check for valid domain format (must have at least one dot and valid TLD)
  // Domain should have format: subdomain.domain.tld or domain.tld
  const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  const domainWithoutPath = domain.split('/')[0]; // Remove path if present
  
  if (!domainRegex.test(domainWithoutPath)) {
    return { isValid: false, error: 'Please enter a valid domain name (e.g., example.com)' };
  }

  // Check for valid TLD (2-6 characters)
  const tldMatch = domainWithoutPath.match(/\.([a-zA-Z]{2,6})$/);
  if (!tldMatch) {
    return { isValid: false, error: 'URL must have a valid domain extension (e.g., .com, .org)' };
  }

  return { isValid: true, error: '' };
};

