export interface WebsiteMetadata {
  display_name?: string;
  favicon_url?: string;
}

const normalizeUrl = (url: string): string => {
  if (!url || typeof url !== 'string') {
    throw new Error('URL is required');
  }
  
  let normalized = url.trim();
  
  if (normalized.startsWith('www.')) {
    normalized = `https://${normalized}`;
  } else if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = `https://${normalized}`;
  }
  
  return normalized;
};

const extractFaviconUrl = (html: string, baseUrl: string): string | undefined => {
  if (!html || typeof html !== 'string' || !baseUrl || typeof baseUrl !== 'string') {
    return undefined;
  }

  const faviconPatterns = [
    /<link[^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*href=["']([^"']+)["']/i,
    /<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon)["']/i,
  ];

  for (const pattern of faviconPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      let faviconUrl = match[1];
      
      if (!faviconUrl || typeof faviconUrl !== 'string') {
        continue;
      }
      
      if (faviconUrl.startsWith('//')) {
        faviconUrl = `https:${faviconUrl}`;
      } else if (faviconUrl.startsWith('/')) {
        try {
          const urlObj = new URL(baseUrl);
          faviconUrl = `${urlObj.protocol}//${urlObj.host}${faviconUrl}`;
        } catch {
          continue;
        }
      } else if (!faviconUrl.startsWith('http')) {
        try {
          faviconUrl = new URL(faviconUrl, baseUrl).href;
        } catch {
          continue;
        }
      }
      
      return faviconUrl;
    }
  }

  try {
    const urlObj = new URL(baseUrl);
    return `${urlObj.protocol}//${urlObj.host}/favicon.ico`;
  } catch {
    return undefined;
  }
};

const extractTitle = (html: string): string | undefined => {
  if (!html || typeof html !== 'string') {
    return undefined;
  }
  
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].trim();
  }
  return undefined;
};

export const fetchWebsiteMetadata = async (url: string): Promise<WebsiteMetadata> => {
  const metadata: WebsiteMetadata = {};

  if (!url || typeof url !== 'string') {
    return metadata;
  }

  try {
    const normalizedUrl = normalizeUrl(url);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(normalizedUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return metadata;
    }

    const html = await response.text();
    
    if (html && typeof html === 'string') {
      const title = extractTitle(html);
      if (title) {
        metadata.display_name = title;
      }

      const faviconUrl = extractFaviconUrl(html, normalizedUrl);
      if (faviconUrl) {
        metadata.favicon_url = faviconUrl;
      }
    }

    return metadata;
  } catch (error) {
    console.warn('Failed to fetch website metadata:', error);
    return metadata;
  }
};

