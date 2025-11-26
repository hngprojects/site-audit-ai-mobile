# Website Audit API Design Specification

## Executive Summary

Frontend expects a specific API structure for scan results. However, the current backend implementation provides data in a different format that doesn't align with frontend requirements or industry API design standards. This document outlines the issues, proposed solutions, and implementation requirements.

## Current Situation

### Frontend Implementation Status
- ✅ Scan initiation: `POST /api/v1/scan/start-async`
- ✅ Status polling: `GET /api/v1/scan/{job_id}/status`
- ✅ Results fetching: `GET /api/v1/scan/{job_id}/results`
- ✅ UI components for summary and detail views
- ✅ Data transformation logic to flatten nested backend data

### Current Pain Points
1. **Data Structure Mismatch**: Backend returns nested page-by-category data, frontend expects flat issue arrays
2. **Performance Issues**: Single large payload contains all detailed data
3. **Scalability Concerns**: No pagination or lazy loading capabilities
4. **User Experience**: All data loads at once, slow initial page loads
5. **Maintenance**: Tight coupling between summary and detail data

## Expected Frontend Data Structure

### Scan Results Summary
```typescript
interface ScanResult {
  job_id: string;
  url: string;
  overall_score: number; // 0-100
  status: 'Good' | 'Warning' | 'Critical';
  issues: Issue[];
  scanned_at: string; // ISO date
  created_at: string; // ISO date
  updated_at: string; // ISO date
}

interface Issue {
  id: string; // Unique issue identifier
  title: string; // Human-readable title
  score: number; // Issue-specific score impact
  description: string; // Detailed description
  category: string; // 'SEO' | 'Performance' | 'Accessibility' | etc.
  severity: 'low' | 'medium' | 'high' | 'critical';
  page_url?: string; // Affected page URL
}
```

### Issue Detail Data
```typescript
interface IssueDetail {
  id: string;
  title: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  score_impact: number;
  page_url: string;
  description: string;
  business_impact: string;
  recommendations: Recommendation[];
  affected_elements: AffectedElement[];
  resources: Resource[];
  created_at: string;
  updated_at: string;
}

interface Recommendation {
  priority: 'low' | 'medium' | 'high' | 'critical';
  action: string;
  implementation: string;
  expected_impact: string;
}

interface AffectedElement {
  selector: string;
  issue: string;
  code_snippet: string;
}

interface Resource {
  title: string;
  url: string;
  type: 'documentation' | 'tool' | 'guide' | 'video';
}
```

## Current Backend Response Structure

### Actual Response Format
```json
{
  "status_code": 200,
  "status": "success",
  "message": "Operation successful",
  "data": {
    "job_id": "019abed1-fdae-7660-a520-42b36b26ebd8",
    "status": "completed",
    "results": {
      "score_overall": 36,
      "score_seo": 32,
      "score_accessibility": 26,
      "score_performance": 64,
      "score_design": 26,
      "total_issues": 0,
      "critical_issues": 0,
      "warnings": 0,
      "pages_discovered": 7,
      "pages_selected": 7,
      "pages_analyzed": 7,
      "selected_pages": [
        {
          "url": "https://example.com/page",
          "score_overall": 28,
          "score_seo": 30,
          "score_accessibility": 10,
          "score_performance": 60,
          "score_design": 10,
          "critical_issues": 0,
          "warnings": 0,
          "analysis_details": {
            "url": "https://example.com/page",
            "overall_score": 28,
            "scan_date": "2025-11-26 06:24:55",
            "ux": {
              "score": 10,
              "title": "Usability",
              "impact_message": "A lack of clear content structure...",
              "impact_score": 10,
              "business_benefits": ["Improve user satisfaction..."],
              "problems": [
                {
                  "icon": "alert",
                  "title": "No Headings Found",
                  "description": "No Headings Found (Error Level)..."
                }
              ]
            },
            "performance": { /* similar structure */ },
            "seo": { /* similar structure */ }
          }
        }
      ]
    }
  }
}
```

### Issues with Current Structure
1. **Nested Complexity**: Data is organized by pages → categories → problems
2. **No Unique IDs**: Problems don't have unique identifiers
3. **Redundant Data**: Business impact repeated across similar issues
4. **Large Payload**: All detailed data sent in single response
5. **No Granular Access**: Cannot fetch individual issue details
6. **Poor Performance**: Frontend must process large nested structure

## Proposed API Design Solution

### Recommended Endpoint Structure

#### 1. Scan Results Summary
**GET** `/api/v1/scan/{job_id}/results`

Returns overview with issue references for efficient loading.

**Response:**
```json
{
  "status_code": 200,
  "status": "success",
  "data": {
    "job_id": "019abed1-fdae-7660-a520-42b36b26ebd8",
    "status": "completed",
    "url": "https://example.com",
    "overall_score": 72,
    "score_breakdown": {
      "seo": 65,
      "accessibility": 78,
      "performance": 70,
      "design": 75
    },
    "total_issues": 12,
    "critical_issues": 3,
    "warning_issues": 5,
    "info_issues": 4,
    "scanned_at": "2024-11-26T12:00:00Z",
    "scan_duration": 45,
    "pages_analyzed": 7,
    "issues": [
      {
        "id": "issue_12345",
        "title": "Missing Page Title",
        "category": "SEO",
        "severity": "high",
        "score_impact": 15,
        "page_url": "https://example.com/page1",
        "short_description": "Page title tag is missing",
        "affected_elements_count": 1
      },
      {
        "id": "issue_12346",
        "title": "Slow Loading Speed",
        "category": "Performance",
        "severity": "medium",
        "score_impact": 8,
        "page_url": "https://example.com/page2",
        "short_description": "Page load time exceeds 3 seconds",
        "affected_elements_count": 3
      }
    ],
    "_links": {
      "self": "/api/v1/scan/019abed1-fdae-7660-a520-42b36b26ebd8/results",
      "status": "/api/v1/scan/019abed1-fdae-7660-a520-42b36b26ebd8/status",
      "issues": "/api/v1/scan/issues"
    }
  }
}
```

#### 2. Individual Issue Details
**GET** `/api/v1/scan/issues/{issue_id}`

Returns comprehensive details for specific issues.

**Response:**
```json
{
  "status_code": 200,
  "status": "success",
  "data": {
    "id": "issue_12345",
    "title": "Missing Page Title",
    "category": "SEO",
    "severity": "high",
    "score_impact": 15,
    "page_url": "https://example.com/page1",
    "description": "The page is missing a <title> tag, which is crucial for SEO and user experience. Title tags appear in search results and browser tabs.",
    "business_impact": "Missing titles can reduce click-through rates from search results by up to 30% and negatively impact search rankings.",
    "recommendations": [
      {
        "priority": "high",
        "action": "Add descriptive title tag",
        "implementation": "<title>Your Descriptive Page Title | Site Name</title>",
        "expected_impact": "Improve SERP CTR by 20-30%",
        "effort": "low",
        "time_estimate": "5 minutes"
      },
      {
        "priority": "medium",
        "action": "Optimize title length",
        "implementation": "Keep titles between 50-60 characters",
        "expected_impact": "Better display in search results",
        "effort": "low",
        "time_estimate": "2 minutes"
      }
    ],
    "affected_elements": [
      {
        "selector": "head",
        "issue": "Missing <title> tag",
        "code_snippet": "<head>\n  <meta charset=\"UTF-8\">\n  <!-- Missing <title> tag -->\n</head>",
        "line_number": 3,
        "suggestion": "Add <title>Your Page Title</title> after charset meta tag"
      }
    ],
    "resources": [
      {
        "title": "Google Page Title Guidelines",
        "url": "https://developers.google.com/search/docs/crawling-indexing/page-titles",
        "type": "documentation",
        "description": "Official Google guidelines for page titles"
      },
      {
        "title": "How to Write Better Page Titles",
        "url": "https://moz.com/learn/seo/title-tag",
        "type": "guide",
        "description": "Comprehensive guide to title tag optimization"
      }
    ],
    "similar_issues": [
      {
        "id": "issue_12346",
        "title": "Duplicate Page Titles",
        "relation": "related"
      }
    ],
    "created_at": "2024-11-26T12:00:00Z",
    "updated_at": "2024-11-26T12:00:00Z",
    "_links": {
      "self": "/api/v1/scan/issues/issue_12345",
      "job": "/api/v1/scan/019abed1-fdae-7660-a520-42b36b26ebd8/results",
      "page": "https://example.com/page1"
    }
  }
}
```

#### 3. Issues List with Filtering
**GET** `/api/v1/scan/issues?job_id={job_id}&category={category}&severity={severity}&page={page}&limit={limit}`

Allows paginated access to issues with filtering.

**Response:**
```json
{
  "status_code": 200,
  "status": "success",
  "data": {
    "issues": [/* array of issue summaries */],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "total_pages": 3
    },
    "filters_applied": {
      "job_id": "019abed1-fdae-7660-a520-42b36b26ebd8",
      "category": "SEO",
      "severity": "high"
    }
  }
}
```

## Implementation Requirements

### Database Schema Changes
1. **issues table**: Store individual issues with unique IDs
2. **issue_details table**: Store comprehensive issue information
3. **issue_affected_elements table**: Store code snippets and selectors
4. **issue_recommendations table**: Store fix suggestions
5. **issue_resources table**: Store helpful links and guides

### API Implementation Tasks
1. **Refactor existing endpoint** to return summary format
2. **Create issue detail endpoint** with full information
3. **Implement issue ID generation** (UUID or hash-based)
4. **Add pagination support** for large result sets
5. **Implement filtering** by category, severity, etc.
6. **Add HATEOAS links** for better API discoverability

### Data Migration Strategy
1. **Extract issues** from existing nested structure
2. **Generate unique IDs** for each problem
3. **Create issue records** with proper relationships
4. **Preserve all existing data** during transition
5. **Update scan status** to reference issue IDs

### Performance Considerations
1. **Database indexing** on frequently queried fields
2. **Caching strategy** for hot issues
3. **CDN integration** for static resources
4. **Rate limiting** to prevent abuse
5. **Response compression** for large payloads

## Migration Timeline

### Phase 1: Backend Preparation (Week 1-2)
- Design new database schema
- Implement new endpoints alongside existing ones
- Create data migration scripts
- Add comprehensive tests

### Phase 2: Frontend Adaptation (Week 3)
- Update API calls to use new endpoints
- Implement lazy loading for issue details
- Add loading states for better UX
- Test with mock data

### Phase 3: Deployment & Testing (Week 4)
- Deploy backend changes
- Run data migration
- Conduct end-to-end testing
- Monitor performance metrics

### Phase 4: Cleanup (Week 5)
- Remove old endpoints after grace period
- Clean up migration scripts
- Update documentation
- Monitor for any issues

## Success Metrics

### Performance Metrics
- **Response Time**: Summary endpoint < 500ms, Detail endpoint < 200ms
- **Payload Size**: Summary < 50KB, Detail < 100KB
- **Concurrent Users**: Support 1000+ simultaneous scans

### User Experience Metrics
- **Page Load Time**: Reduce initial load by 60%
- **Time to Interactive**: Improve by 40%
- **Error Rate**: Maintain < 1%

### API Quality Metrics
- **Uptime**: 99.9% availability
- **Success Rate**: 99.5% of requests
- **Data Accuracy**: 100% consistency

## Conclusion

This redesign addresses current scalability and performance issues while following REST API best practices. The separation of summary and detail data enables better user experience through progressive loading and reduces server load through granular data access.

The new structure provides:
- **Better Performance**: Lazy loading of detailed data
- **Improved Scalability**: Paginated and filtered access
- **Enhanced UX**: Faster initial loads, detailed on-demand
- **Future-Proofing**: Extensible for additional features
- **Industry Standards**: RESTful design with HATEOAS support

Please review and provide feedback on this specification. Implementation should begin with the database schema design and API prototyping.