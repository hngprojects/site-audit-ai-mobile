export interface UrlValidationResult {
  isValid: boolean;
  error: string;
}

export const validateWebsiteUrl = (url: string): UrlValidationResult => {
  if (!url || url.trim() === '') {
    return { isValid: false, error: 'Please enter a website URL' };
  }

  const trimmedUrl = url.trim();

  const startsWithValid = trimmedUrl.startsWith('https://') || trimmedUrl.startsWith('www.');
  if (!startsWithValid) {
    return { isValid: false, error: 'URL must start with "https://" or "www."' };
  }

  const domainExtensionRegex = /\.[a-zA-Z]{2,6}(\/|$)/;
  if (!domainExtensionRegex.test(trimmedUrl)) {
    return { isValid: false, error: 'URL must have a valid domain extension (e.g., .com, .org)' };
  }

  return { isValid: true, error: '' };
};

