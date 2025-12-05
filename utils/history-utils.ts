import type { ScanHistoryItem, SummaryResult } from '@/lib/scan-service';
import type { Status } from '@/type';

/**
 * Groups scan history items by site URL and returns the most recent scan for each unique site
 * @param historyItems - Array of scan history items from the API
 * @returns Array of unique sites with their most recent scan
 */
export interface UniqueSiteWithLatestScan {
    siteId: string;
    rootUrl: string;
    latestScan: ScanHistoryItem;
}

export const getUniqueSitesWithLatestScan = (
    historyItems: ScanHistoryItem[]
): UniqueSiteWithLatestScan[] => {
    // Group by site root_url
    const siteMap = new Map<string, ScanHistoryItem[]>();

    historyItems.forEach((item) => {
        const url = item.site.root_url;
        if (!siteMap.has(url)) {
            siteMap.set(url, []);
        }
        siteMap.get(url)!.push(item);
    });

    // Get the most recent scan for each site
    const uniqueSites: UniqueSiteWithLatestScan[] = [];

    siteMap.forEach((scans, rootUrl) => {
        // Sort by created_at descending (most recent first)
        const sortedScans = [...scans].sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return dateB - dateA;
        });

        const latestScan = sortedScans[0];
        uniqueSites.push({
            siteId: latestScan.site.id,
            rootUrl: rootUrl,
            latestScan: latestScan,
        });
    });

    // Sort unique sites by most recent scan date
    return uniqueSites.sort((a, b) => {
        const dateA = new Date(a.latestScan.created_at).getTime();
        const dateB = new Date(b.latestScan.created_at).getTime();
        return dateB - dateA;
    });
};

/**
 * Filters history items by a specific site URL
 * @param historyItems - Array of scan history items from the API
 * @param siteUrl - The site URL to filter by
 * @returns Array of scan history items for the specified site, sorted by most recent first
 */
export const getHistoryBySiteUrl = (
    historyItems: ScanHistoryItem[],
    siteUrl: string
): ScanHistoryItem[] => {
    return historyItems
        .filter((item) => item.site.root_url === siteUrl)
        .sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return dateB - dateA; // Most recent first
        });
};

/**
 * Formats a date string to a readable format
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "Dec 15, 2024")
**/
export const formatScanDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

/**
 * Formats a date string to time format
 * @param dateString - ISO date string
 * @returns Formatted time string (e.g., "10:30 AM")
 */
export const formatScanTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
};

/**
 * Gets status from a score value
 * @param score - Score value (0-100)
 * @returns Status based on score
 */
export const getStatusFromScore = (score?: number): Status => {
    if (score === undefined || score === null) return 'Warning';
    if (score >= 80) return 'Good';
    if (score >= 50) return 'Warning';
    return 'Critical';
};

/**
 * Extracts domain from URL
 * @param url - Full URL
 * @returns Domain name without protocol and www
 */
export const extractDomain = (url: string): string => {
    if (!url) return 'N/A';
    return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0] || 'N/A';
};

/**
 * Creates a map of job_id to score for efficient lookups
 * @param scoreMap - Map of job_id to SummaryResult (from getScanSummary)
 * @returns Map of job_id to score
 */
export const createScoreMap = (
    scoreMap: Map<string, SummaryResult>
): Map<string, number> => {
    const map = new Map<string, number>();
    scoreMap.forEach((summary, jobId) => {
        map.set(jobId, summary.website_score);
    });
    return map;
};

/**
 * Gets all unique job IDs from history items for batch score fetching
 * @param historyItems - Array of history items
 * @returns Array of unique job IDs
 */
export const getJobIdsFromHistory = (
    historyItems: ScanHistoryItem[]
): string[] => {
    return historyItems.map(item => item.id);
};

/**
 * Transforms a unique site with latest scan to the format needed for reports tab
 * @param uniqueSite - Unique site with latest scan
 * @param scoreMap - Optional map of job_id to score for enriching with scores
 */
export interface ReportItemFromHistory {
    siteId: string;
    url: string;
    domain: string;
    score: number;
    status: Status;
    scanDate: string;
    jobId: string;
}

export const transformUniqueSiteToReportItem = (
    uniqueSite: UniqueSiteWithLatestScan,
    scoreMap?: Map<string, number>
): ReportItemFromHistory => {
    const jobId = uniqueSite.latestScan.id;
    const score = scoreMap?.get(jobId) ?? 0;

    return {
        siteId: uniqueSite.siteId,
        url: uniqueSite.rootUrl,
        domain: extractDomain(uniqueSite.rootUrl),
        score: score,
        status: getStatusFromScore(score),
        scanDate: formatScanDate(uniqueSite.latestScan.completed_at || uniqueSite.latestScan.created_at),
        jobId: jobId,
    };
};

/**
 * Transforms a scan history item to a format suitable for the history screen
 * @param item - Scan history item from API
 * @param scoreMap - Optional map of job_id to score for enriching with scores
 */
export interface HistoryItemForUI {
    id: string;
    url: string;
    score?: number; // Optional - can be fetched using job_id via getScanSummary
    scanDate: string;
    scanTime: string;
    date: Date;
    jobId: string;
    status: string;
}

export const transformHistoryItemForUI = (
    item: ScanHistoryItem,
    scoreMap?: Map<string, number>
): HistoryItemForUI => {
    const score = scoreMap?.get(item.id);

    return {
        id: item.id,
        url: item.site.root_url,
        score: score, // Will be undefined if not in scoreMap
        scanDate: formatScanDate(item.completed_at || item.created_at),
        scanTime: formatScanTime(item.completed_at || item.created_at),
        date: new Date(item.completed_at || item.created_at),
        jobId: item.id,
        status: item.status,
    };
};

