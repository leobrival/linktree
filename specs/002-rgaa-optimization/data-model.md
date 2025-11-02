# Phase 1: Accessibility Data Model

**Status**: Complete
**Date**: 2025-11-02

## Overview

This document defines the data structures and metrics for tracking RGAA 4.1 accessibility compliance throughout the development lifecycle. These models support testing, auditing, and continuous accessibility monitoring.

---

## Entity Definitions

### AccessibilityProfile Entity

Represents the overall accessibility maturity and compliance status of the linktree.

```typescript
interface AccessibilityProfile {
  id: string;                          // Unique identifier
  projectName: string;                 // "Personal Linktree"
  rgaaVersion: string;                 // "4.1"
  targetWcagLevel: "A" | "AA" | "AAA"; // Target: "AA"
  currentComplianceLevel: "A" | "AA" | "AAA" | "None";

  // Compliance Status
  isCompliant: boolean;                // True if all critical issues resolved
  compliancePercentage: number;        // 0-100%, represents resolved requirements
  lastAuditDate: string;               // ISO 8601 date format
  nextAuditDate: string;               // Scheduled next audit

  // Testing Status
  automatedTestingStatus: "passed" | "failed" | "pending";
  manualTestingStatus: "passed" | "failed" | "pending";
  screenReaderTesting: {
    nvda: boolean;                     // NVDA (Windows)
    jaws: boolean;                     // JAWS (Windows)
    voiceOver: boolean;                // VoiceOver (macOS/iOS)
    talkBack: boolean;                 // TalkBack (Android)
  };
  keyboardNavigationTested: boolean;
  contrastTestedLevel: "AA" | "AAA";   // Minimum level tested

  // Team & Process
  accessibilityOwner: string;          // Team member responsible
  lastModified: string;                // ISO 8601 timestamp
  accessibilityStatement: string;      // URL or text of accessibility declaration
}
```

**Validation Rules**:
- `compliancePercentage` must be 0-100
- `lastAuditDate` cannot be in the future
- `nextAuditDate` should be 3-6 months from lastAuditDate
- All required screen reader tests must pass for "AA" compliance

**Storage Location**: `.accessibility/profile.json` at project root

---

### AccessibilityAudit Entity

Records a comprehensive accessibility testing session with detailed results.

```typescript
interface AccessibilityAudit {
  id: string;                          // Unique audit ID (UUID)
  profileId: string;                   // Reference to AccessibilityProfile
  auditDate: string;                   // ISO 8601 date
  auditType: "automated" | "manual" | "comprehensive"; // Type of audit

  // Auditor Information
  auditorName: string;                 // Person who performed audit
  auditorRole: "developer" | "qa" | "specialist" | "third-party";
  auditorQualification: string;        // e.g., "RGAA Certified", "IAAP CPWA"

  // Tool Information (for automated audits)
  tools: {
    name: string;                      // e.g., "Axe DevTools", "Lighthouse"
    version: string;
    resultsUrl: string;                // Link to tool results (if available)
  }[];

  // Test Coverage
  topicsCovered: {
    topic: string;                     // e.g., "Images", "Colors", "Keyboard"
    criteriaCount: number;             // How many criteria tested
    passingCriteria: number;
    failingCriteria: number;
  }[];

  // Summary Results
  summary: {
    totalCriteria: number;             // Total RGAA/WCAG criteria assessed
    criticalIssues: number;            // Blocking compliance
    seriousIssues: number;             // Significant problems
    minorIssues: number;               // Small improvements
    totalIssues: number;               // Sum of above
    complianceScore: number;           // 0-100%
  };

  // Detailed Results
  results: AuditResult[];              // Array of individual criterion results
  issues: AccessibilityIssue[];        // Detailed issue list
  notes: string;                       // Auditor notes and observations

  // Recommendations
  recommendations: {
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
    affectedComponent: string;
    estimatedEffort: "1 hour" | "2-4 hours" | "1 day" | "2-5 days" | "1+ week";
  }[];

  // Metadata
  browserVersion: string;              // e.g., "Chrome 120.0"
  screenReaderVersion?: string;        // For manual testing
  pageUrl: string;                     // URL tested
  viewportSize: string;                // e.g., "1920x1080"
}
```

**Validation Rules**:
- Sum of passingCriteria, failingCriteria must equal criteriaCount
- totalIssues = criticalIssues + seriousIssues + minorIssues
- complianceScore = (totalCriteria - totalIssues) / totalCriteria * 100
- auditDate must not be in the future

**Relationships**:
- One AccessibilityProfile has many AccessibilityAudits
- Each audit references multiple AuditResults and AccessibilityIssues

---

### AuditResult Entity

Represents the testing result for a single RGAA criterion.

```typescript
interface AuditResult {
  id: string;                          // Unique result ID
  auditId: string;                     // Reference to parent audit

  // Criterion Information
  criterion: {
    number: string;                    // RGAA criterion number (e.g., "1.1.1")
    title: string;                     // Criterion title
    wcagEquivalent: string;            // WCAG 2.1 equivalent (e.g., "WCAG 1.1.1")
    wcagLevel: "A" | "AA" | "AAA";     // WCAG conformance level
  };

  // Test Result
  status: "passed" | "failed" | "not-applicable" | "incomplete";
  severity: "critical" | "serious" | "minor";

  // Details
  description: string;                 // What was tested
  expectedBehavior: string;            // What should happen
  actualBehavior: string;              // What actually happens
  testMethod: string;                  // How it was tested (automated/manual)

  // Components Affected
  affectedComponents: string[];        // Which UI parts failed (e.g., ["LinkCard", "ProfileImage"])
  elementsChecked: number;             // How many elements were evaluated
  elementsPassed: number;              // How many passed the test
  elementsFailed: number;              // How many failed

  // Evidence
  evidenceUrl?: string;                // Screenshot or recording of issue
  exampleElement?: string;             // HTML snippet showing problem

  // Remediation Status
  isResolved: boolean;                 // Has this been fixed?
  resolvedDate?: string;               // When was it fixed?
}
```

**Validation Rules**:
- `status` must be one of specified values
- `severity` must match status (can't be "critical" if status is "passed")
- `elementsFailed` + `elementsPassed` ≤ `elementsChecked`
- `resolvedDate` can only be set if `isResolved` is true

---

### AccessibilityIssue Entity

Detailed representation of a single accessibility problem requiring remediation.

```typescript
interface AccessibilityIssue {
  id: string;                          // Unique issue ID (e.g., "A001", "A042")
  auditId: string;                     // Reference to audit where issue was found

  // Classification
  criterion: {
    number: string;                    // RGAA criterion (e.g., "1.1.1")
    topic: string;                     // RGAA topic (e.g., "Images")
    title: string;                     // Criterion name
  };

  // Severity & Impact
  severity: "critical" | "serious" | "minor";
  impactLevel: "high" | "medium" | "low";  // Who is affected
  affectedUsers: {
    group: string;                     // e.g., "screen reader users"
    estimatedImpact: string;           // e.g., "cannot navigate page"
  }[];

  // Issue Details
  title: string;                       // Short summary
  description: string;                 // Detailed problem description
  affectedComponent: string;           // React component or HTML element
  affectedElements: {
    selector: string;                  // CSS selector
    line?: number;                     // Source code line number
    file?: string;                     // Source file path
  }[];

  // Current State
  reproductionSteps: string[];         // How to see the problem
  evidence: {
    type: "screenshot" | "recording" | "code-snippet" | "url";
    url: string;                       // Link to evidence
    description: string;               // What the evidence shows
  }[];

  // Solution
  remediationSteps: string[];          // How to fix it
  suggestedCode?: string;              // Code example of fix
  resourceLinks: string[];             // Links to RGAA/WCAG docs
  estimatedEffort: "5 min" | "15 min" | "30 min" | "1 hour" | "2-4 hours" | "1+ day";

  // Tracking
  status: "open" | "in-progress" | "resolved" | "verified" | "wont-fix";
  priority: "p0" | "p1" | "p2" | "p3";
  createdDate: string;                 // When issue was discovered
  resolvedDate?: string;               // When it was fixed
  assignedTo?: string;                 // Developer assigned

  // Verification
  verificationMethod: string;          // How will fix be verified?
  verificationSteps: string[];         // Steps to verify resolution
  verified: boolean;                   // Has it been verified as fixed?
  verificationDate?: string;
  verificationNotes?: string;

  // Metadata
  tags: string[];                      // e.g., ["wcag-2.1", "keyboard", "urgent"]
  relatedIssues: string[];             // Links to related GitHub issues
}
```

**Validation Rules**:
- `severity` matches impact of issue
- `status` progression: open → in-progress → resolved → verified
- `resolvedDate` required if status is "resolved" or higher
- `verificationDate` required if `verified` is true

---

### AccessibilityRequirement Entity

Tracks implementation status of specific RGAA requirements.

```typescript
interface AccessibilityRequirement {
  id: string;                          // Requirement ID from spec (e.g., "FR-A-001")

  // Requirement Details
  category: string;                    // e.g., "Semantic HTML", "Text Alternatives"
  title: string;                       // Requirement title
  criterion: string;                   // Associated RGAA criterion (e.g., "1.1.1")
  description: string;                 // Full requirement text

  // Implementation Status
  status: "pending" | "in-progress" | "implemented" | "tested" | "verified";
  acceptanceCriteria: {
    criterion: string;                 // Testable criterion
    implemented: boolean;
  }[];

  // Testing
  testMethod: "automated" | "manual" | "both";
  testsToPass: {
    name: string;
    tool: string;                      // e.g., "Axe", "Manual Testing"
    passed: boolean;
  }[];

  // Components Affected
  affectedComponents: string[];        // React components or HTML elements
  implementationNotes: string;         // Developer notes

  // Tracking
  implementedDate?: string;
  testedDate?: string;
  verifiedDate?: string;
  developerId?: string;                // Who implemented it
  testerId?: string;                   // Who tested it
}
```

---

### ScreenReaderCompatibility Entity

Documents screen reader testing and compatibility matrix.

```typescript
interface ScreenReaderCompatibility {
  id: string;                          // Unique ID
  componentName: string;               // React component tested

  // Screen Reader Matrix
  compatibility: {
    screenReader: "NVDA" | "JAWS" | "VoiceOver" | "TalkBack";
    version: string;
    browser: string;                   // e.g., "Chrome", "Firefox", "Safari"
    status: "compatible" | "partial" | "incompatible";
    notes: string;
    lastTestedDate: string;
    testerName: string;
  }[];

  // Announcements Verified
  announcementsVerified: {
    element: string;                   // What gets announced
    expectedAnnouncement: string;      // What screen reader should say
    actualAnnouncements: {
      screenReader: string;
      announcement: string;            // What was actually announced
    }[];
  }[];

  // Issues Found
  issuesFound: {
    screenReader: string;
    issue: string;
    severity: "critical" | "serious" | "minor";
  }[];

  // Overall Status
  allCompatible: boolean;              // All major screen readers work
  lastAuditDate: string;
}
```

---

### KeyboardNavigationTest Entity

Documents keyboard navigation testing results.

```typescript
interface KeyboardNavigationTest {
  id: string;
  testDate: string;
  testerName: string;

  // Overall Results
  allKeysWorking: boolean;
  focusOrderLogical: boolean;
  focusIndicatorVisible: boolean;
  noKeyboardTraps: boolean;

  // Detailed Tests
  tests: {
    action: string;                    // e.g., "Tab through all links"
    expectedResult: string;            // What should happen
    actualResult: string;              // What happened
    passed: boolean;
    notes: string;
  }[];

  // Focus Order
  focusOrder: {
    order: number;
    element: string;                   // Element that receives focus
    isLogical: boolean;
  }[];

  // Focus Indicator
  focusIndicator: {
    component: string;
    visible: boolean;
    minPixelWidth: number;
    hasEnoughContrast: boolean;
    notes: string;
  }[];

  // Summary
  issuesFound: number;
  issuesSeverity: {
    critical: number;
    serious: number;
    minor: number;
  };
  recommendations: string[];
}
```

---

### ContrastTestResult Entity

Documents color contrast testing results.

```typescript
interface ContrastTestResult {
  id: string;
  testDate: string;
  testerName: string;

  // Test Configuration
  targetLevel: "AA" | "AAA";           // "AA" = 4.5:1, "AAA" = 7:1

  // Test Results
  elements: {
    selector: string;
    elementType: "text" | "ui-component" | "graphic";
    foregroundColor: string;           // Hex color
    backgroundColor: string;           // Hex color
    contrastRatio: number;             // e.g., 4.5
    requiredRatio: number;             // Minimum required
    passed: boolean;
    notes?: string;
  }[];

  // Summary
  totalElementsTested: number;
  elementsPassed: number;
  elementsFailed: number;
  compliancePercentage: number;

  // Enhanced Contrast Testing
  enhancedContrastMode: {
    tested: boolean;
    passed: boolean;
    notes: string;
  };

  // Recommendations
  elementsNeedingFix: {
    selector: string;
    currentRatio: number;
    requiredRatio: number;
    suggestedFix: string;
  }[];
}
```

---

## State Management

### Accessibility State Model

The application maintains accessibility-related state:

```typescript
interface AccessibilityState {
  // Current Profile
  profile: AccessibilityProfile | null;

  // Testing Status
  audits: AccessibilityAudit[];        // All historical audits
  currentAudit: AccessibilityAudit | null;

  // Issues Tracking
  openIssues: AccessibilityIssue[];    // Current unresolved issues
  resolvedIssues: AccessibilityIssue[];
  issueCount: {
    critical: number;
    serious: number;
    minor: number;
  };

  // Requirements
  requirements: AccessibilityRequirement[];
  requirementsCoverage: {
    total: number;
    implemented: number;
    tested: number;
    verified: number;
  };

  // Compliance Metrics
  compliancePercentage: number;        // Overall % of requirements met
  wcagLevel: "A" | "AA" | "AAA" | "None";
  rgaaCompliant: boolean;

  // Testing Status
  automatedTestsPassed: boolean;
  manualTestsPassed: boolean;
  screenReaderTestsPassed: boolean;
  keyboardTestsPassed: boolean;
}
```

---

## Data Relationships

```
AccessibilityProfile (1)
├── AccessibilityAudit (many)
│   ├── AuditResult (many)
│   └── AccessibilityIssue (many)
├── AccessibilityRequirement (many)
├── ScreenReaderCompatibility (many)
├── KeyboardNavigationTest (many)
└── ContrastTestResult (many)
```

**Key Relationships**:
- One Profile describes many Audits
- Each Audit contains multiple Results and Issues
- Issues reference Requirements
- Each component has Screen Reader, Keyboard, and Contrast tests

---

## Data Validation Rules

### AccessibilityProfile Validation

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| id | string | Yes | UUID format |
| projectName | string | Yes | Non-empty |
| rgaaVersion | string | Yes | "4.1" or later |
| currentComplianceLevel | enum | Yes | A, AA, AAA, or None |
| compliancePercentage | number | Yes | 0-100 |
| lastAuditDate | string | Yes | Valid ISO 8601 date |

### AccessibilityAudit Validation

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| id | string | Yes | UUID format |
| auditDate | string | Yes | Not in future |
| totalCriteria | number | Yes | > 0 |
| totalIssues | number | Yes | ≥ 0, ≤ totalCriteria |
| complianceScore | number | Yes | 0-100 |

### AccessibilityIssue Validation

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| id | string | Yes | Unique in project |
| criterion | object | Yes | Valid RGAA criterion |
| severity | enum | Yes | critical, serious, or minor |
| status | enum | Yes | open, in-progress, resolved, etc. |

---

## File Storage

### Directory Structure

```
project-root/
└── .accessibility/
    ├── profile.json                   # AccessibilityProfile
    ├── requirements.json              # AccessibilityRequirement[]
    ├── audits/
    │   ├── 2025-11-02-audit-001.json # AccessibilityAudit
    │   ├── 2025-11-09-audit-002.json
    │   └── results/
    │       └── 2025-11-02/            # Screenshot evidence
    ├── issues/
    │   ├── A001-semantic-html.json    # AccessibilityIssue
    │   ├── A002-alt-text.json
    │   └── ...
    ├── screen-reader-tests/
    │   ├── nvda-results.json          # ScreenReaderCompatibility
    │   ├── jaws-results.json
    │   └── ...
    ├── keyboard-tests/
    │   └── navigation-test-2025-11-02.json
    ├── contrast-tests/
    │   └── contrast-audit-2025-11-02.json
    └── reports/                       # Generated accessibility reports
        ├── monthly-report-2025-11.json
        └── compliance-checklist.md
```

### Data Persistence

- JSON files stored in `.accessibility/` directory
- Files tracked in git for version history
- Sensitive data (auditor names) stored separately if needed
- Automated reports generated from JSON data

---

## Example: Complete Audit Flow

### data.json Structure Example

```json
{
  "profile": {
    "id": "linktree-001",
    "projectName": "Personal Linktree",
    "rgaaVersion": "4.1",
    "targetWcagLevel": "AA",
    "currentComplianceLevel": "AA",
    "isCompliant": true,
    "compliancePercentage": 95,
    "lastAuditDate": "2025-11-02T10:00:00Z",
    "automatedTestingStatus": "passed",
    "manualTestingStatus": "passed",
    "screenReaderTesting": {
      "nvda": true,
      "jaws": true,
      "voiceOver": true,
      "talkBack": false
    },
    "keyboardNavigationTested": true,
    "contrastTestedLevel": "AA"
  },
  "latestAudit": {
    "id": "audit-20251102-001",
    "auditType": "comprehensive",
    "summary": {
      "totalCriteria": 50,
      "criticalIssues": 0,
      "seriousIssues": 2,
      "minorIssues": 3,
      "complianceScore": 90
    }
  }
}
```

---

## Implementation Considerations

### Automated Testing Integration

- Axe testing results imported into AuditResult schema
- Lighthouse scores recorded in each audit
- WAVE results compared against manual testing

### Manual Testing Workflow

1. Auditor performs manual test (keyboard, screen reader, etc.)
2. Results recorded in appropriate entity (KeyboardNavigationTest, ScreenReaderCompatibility)
3. Issues identified and created as AccessibilityIssue records
4. Issues prioritized and assigned to developers
5. Developers implement fixes and request re-testing
6. Auditor verifies fixes and marks issue as resolved

### CI/CD Integration

- Automated accessibility tests run on every commit
- Results stored as AccessibilityAudit
- Compliance percentage calculated automatically
- Alerts sent if compliance drops below threshold

### Reporting & Metrics

- Monthly accessibility reports generated from audit data
- Dashboard showing compliance trends
- Issue resolution tracking
- Team accountability metrics

---

## Version History

**v1.0.0** (2025-11-02):
- Initial accessibility data model
- RGAA 4.1 compliance tracking
- Audit and issue management
- Screen reader and keyboard testing entities
- Contrast testing support
