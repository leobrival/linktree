# Accessibility Testing API Contracts

**Feature**: RGAA 4.1 Accessibility Optimization
**Document**: Testing Integration Contracts
**Version**: 1.0.0
**Status**: Complete

---

## Overview

This document defines the contracts (interfaces and expected behaviors) for accessibility testing tools and APIs that will be integrated into the development and CI/CD pipeline.

---

## 1. Axe DevTools Contract

### Purpose
Automated accessibility testing to catch WCAG 2.1 and RGAA violations programmatically.

### Integration Points
- Local development (Chrome extension)
- CI/CD pipeline (axe-core npm package)
- Pre-deployment validation

### Interface

#### axe.run(selector, options)
```typescript
interface AxeOptions {
  branding?: {
    brand?: string;
    application?: string;
  };
  reporter?: 'v1' | 'v2' | 'csv' | 'json';
  resultTypes?: Array<'violations' | 'passes' | 'inapplicable' | 'incomplete' | 'incomplete'>;
  rules?: {
    enabled?: string[];
    disabled?: string[];
  };
  runOnly?: {
    type?: 'rule' | 'rules';
    values?: string[];
  };
}

interface AxeResult {
  violations: {
    id: string;              // Rule ID (e.g., "color-contrast")
    impact: 'critical' | 'serious' | 'moderate' | 'minor';
    tags: string[];          // ['wcag2aa', 'wcag2aaa', etc.]
    description: string;
    help: string;            // Remediation guidance
    helpUrl: string;         // Link to documentation
    nodes: Array<{
      html: string;          // Element HTML
      target: string[];      // CSS selector path
      failureSummary: string;
    }>;
  }[];
  passes: Array<{
    id: string;
    impact: string;
    tags: string[];
    description: string;
    nodes: number;           // Count of passing elements
  }>;
  inapplicable: Array<{
    id: string;
    tags: string[];
    description: string;
  }>;
  incomplete: Array<{
    id: string;
    impact: string;
    tags: string[];
    description: string;
    help: string;
  }>;
  url: string;               // Tested page URL
  timestamp: string;         // ISO 8601 timestamp
  testEngine?: {
    name: string;
    version: string;
  };
}

async function axe.run(): Promise<AxeResult>
```

### Expected Compliance Levels

#### For RGAA Conformance:
```
CRITICAL ISSUES: 0 (blocking)
SERIOUS ISSUES: 0 (blocking)
MODERATE ISSUES: <5 (should fix)
MINOR ISSUES: <10 (nice to have)
```

### Integration Example

```javascript
// In CI/CD pipeline
const { axe } = require('axe-core');

async function runAccessibilityTest(pageUrl) {
  try {
    const results = await axe.run();

    const critical = results.violations.filter(v => v.impact === 'critical').length;
    const serious = results.violations.filter(v => v.impact === 'serious').length;

    if (critical > 0 || serious > 0) {
      throw new Error(`Accessibility test failed: ${critical} critical, ${serious} serious issues`);
    }

    return { passed: true, results };
  } catch (error) {
    return { passed: false, error: error.message };
  }
}
```

### Reporting Format
```json
{
  "tool": "Axe DevTools",
  "timestamp": "2025-11-02T10:30:00Z",
  "pageUrl": "https://example.com/linktree",
  "results": {
    "violations": 3,
    "critical": 0,
    "serious": 0,
    "moderate": 2,
    "minor": 1
  },
  "passed": true,
  "score": 98
}
```

---

## 2. Lighthouse Accessibility Audit Contract

### Purpose
Comprehensive performance and accessibility audit including automated accessibility checks.

### Integration Points
- Local development (Chrome DevTools)
- CI/CD pipeline (lighthouse npm package)
- Performance monitoring

### Interface

```typescript
interface LighthouseOptions {
  port?: number;
  output?: 'json' | 'csv' | 'html';
  logLevel?: 'error' | 'info' | 'verbose';
  chromeFlags?: string[];
  maxWaitForLoad?: number;
  emulatedFormFactor?: 'mobile' | 'desktop';
}

interface LighthouseResult {
  requestedUrl: string;
  finalUrl: string;
  fetchTime: string;           // ISO 8601 timestamp
  lighthouseVersion: string;
  scores: {
    performance: number;       // 0-100
    accessibility: number;     // 0-100 (target: 90+)
    best-practices: number;    // 0-100
    seo: number;              // 0-100
    pwa: number;              // 0-100 (if applicable)
  };
  audits: {
    'accessibility-label': AuditResult;
    'accessibility-valid-aria-role': AuditResult;
    'contrast': AuditResult;
    'button-name': AuditResult;
    'color-contrast': AuditResult;
    'image-alt': AuditResult;
    // ... many more
  };
}

interface AuditResult {
  id: string;
  score?: number;             // 0-1 or null if not applicable
  scoreDisplayMode: 'numeric' | 'binary' | 'not-applicable';
  title: string;
  description: string;
  details?: {
    type: 'table' | 'list' | 'opportunity';
    items: Array<{
      node?: {
        type: 'node';
        selector: string;
        snippet: string;
        nodeLabel: string;
      };
      url?: string;
      failures?: string[];
    }>;
  };
}
```

### Expected Compliance Levels

#### For RGAA Conformance:
```
Accessibility Score: 90+ / 100 (target)
All critical audits passing (color-contrast, image-alt, button-name)
No failed audits
```

### Integration Example

```javascript
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function runLighthouseAudit(pageUrl) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });

  const results = await lighthouse(pageUrl, {
    port: chrome.port,
    output: 'json',
    emulatedFormFactor: 'desktop'
  });

  const a11yScore = results.lhr.categories.accessibility.score * 100;

  if (a11yScore < 90) {
    console.warn(`Accessibility score below target: ${a11yScore}/100`);
  }

  await chromeLauncher.kill(chrome.pid);
  return results;
}
```

### Reporting Format
```json
{
  "tool": "Lighthouse",
  "timestamp": "2025-11-02T10:35:00Z",
  "scores": {
    "accessibility": 95,
    "performance": 92,
    "best-practices": 88,
    "seo": 96
  },
  "passed": true,
  "audits": {
    "color-contrast": { "passed": true },
    "image-alt": { "passed": true },
    "button-name": { "passed": true }
  }
}
```

---

## 3. WAVE Validation Contract

### Purpose
Web accessibility evaluation to identify accessibility and compliance issues.

### Integration Points
- Browser extension (manual testing)
- Online API (https://wave.webaim.org/api/)
- Automated pipeline validation

### Interface

```typescript
interface WaveApiOptions {
  key?: string;              // API key (required for API)
  format?: 'json' | 'xml';
  reporttype?: 'standard' | 'detailed';
}

interface WaveResult {
  status: {
    success: boolean;
    httpstatuscode: number;
  };
  statistics: {
    pagetitle: string;
    pageurl: string;
    time: number;
    allitemcount: number;
    errorcount: number;
    warningcount: number;
    contrastcount: number;
    featurecount: number;
    structurecount: number;
  };
  categories: {
    error: {
      items: {
        [key: string]: Array<{
          id: string;
          description: string;
          count: number;
        }>;
      };
      description: string;
    };
    contrast: {
      items: { [key: string]: any };
      description: string;
    };
    // ... other categories
  };
}
```

### Expected Compliance Levels

#### For RGAA Conformance:
```
ERRORS: 0 (blocking)
CONTRAST ISSUES: 0 (blocking)
All errors must be resolved before deployment
```

### Reporting Format
```json
{
  "tool": "WAVE",
  "timestamp": "2025-11-02T10:40:00Z",
  "statistics": {
    "errorcount": 0,
    "warningcount": 2,
    "contrastcount": 0
  },
  "passed": true,
  "details": {
    "errors": [],
    "contrast": []
  }
}
```

---

## 4. Screen Reader Testing Contract

### Purpose
Manual testing with assistive technology to verify content announcements and functionality.

### Supported Screen Readers

#### NVDA (Windows - Free)
```typescript
interface NvdaTestSession {
  screenReader: 'NVDA';
  version: string;          // e.g., "2024.1"
  browser: 'Firefox' | 'Chrome' | 'Edge';
  browserVersion: string;
  testDate: string;         // ISO 8601
  testerName: string;
  testResults: {
    contentAnnounced: boolean;
    headingsIdentified: boolean;
    landmarksIdentified: boolean;
    linkPurposeClear: boolean;
    formLabelsLinked: boolean;
    focusMovementLogical: boolean;
    issuesFound: Array<{
      element: string;
      issue: string;
      severity: 'critical' | 'serious' | 'minor';
    }>;
  };
}
```

#### VoiceOver (macOS/iOS - Built-in)
```typescript
interface VoiceOverTestSession {
  screenReader: 'VoiceOver';
  platform: 'macOS' | 'iOS';
  osVersion: string;
  browser: 'Safari' | 'Chrome';
  browserVersion: string;
  testDate: string;         // ISO 8601
  testerName: string;
  testResults: {
    contentAnnounced: boolean;
    rotor: {
      headingsWork: boolean;
      linksWork: boolean;
      formItemsWork: boolean;
    };
    gestures: {
      swipeNavigationWorks: boolean;
      doubleTabActivates: boolean;
    };
    issuesFound: Array<{
      element: string;
      issue: string;
      severity: 'critical' | 'serious' | 'minor';
    }>;
  };
}
```

### Test Script Template
```
# NVDA Testing Script

## Setup
1. Open NVDA
2. Set reading speed to normal (50%)
3. Open target page in Firefox/Chrome
4. Turn on screen reader

## Navigation Test
1. Tab through page - note all elements
2. Use H key to navigate headings
3. Use Ctrl+Home to go to page start
4. Use Ctrl+End to go to page end

## Announcement Test
- [ ] Page title announced?
- [ ] Landmarks announced?
- [ ] Heading hierarchy clear?
- [ ] Links have purpose?
- [ ] Images have alt text?
- [ ] Form labels linked?

## Results
- [ ] All elements announced correctly
- [ ] Navigation logical
- [ ] No missing content
- [ ] No extra or confusing announcements
```

### Reporting Format
```json
{
  "tool": "Screen Reader Testing",
  "session": {
    "screenReader": "NVDA",
    "browser": "Firefox",
    "testDate": "2025-11-02"
  },
  "results": {
    "contentAnnounced": true,
    "headingsIdentified": true,
    "landmarksIdentified": true,
    "passed": true,
    "issuesFound": []
  }
}
```

---

## 5. Contrast Testing Contract

### Purpose
Verify text and UI component contrast ratios meet WCAG requirements.

### Tool: WebAIM Contrast Checker

```typescript
interface ContrastCheckResult {
  foreground: {
    color: string;           // Hex color (e.g., #333333)
    hexValue: string;
    rgbValue: string;
    hslValue: string;
  };
  background: {
    color: string;
    hexValue: string;
    rgbValue: string;
    hslValue: string;
  };
  contrastRatio: number;     // e.g., 4.5
  conformance: {
    AA: boolean;             // 4.5:1 for normal, 3:1 for large
    AAA: boolean;            // 7:1 for normal, 4.5:1 for large
    AALargeText: boolean;    // 3:1 for 18px+
    AALargeTextAAA: boolean; // 4.5:1 for 18px+
  };
}

interface FullContrastAudit {
  timestamp: string;
  elements: ContrastCheckResult[];
  summary: {
    totalElements: number;
    aaCompliant: number;
    aaaCompliant: number;
    failed: number;
    percentage: number;      // % compliant
  };
  passed: boolean;           // All elements AA compliant?
}
```

### Expected Compliance Levels

#### For RGAA Conformance:
```
Normal text (≤18px): 4.5:1 minimum
Large text (≥18px): 3:1 minimum
UI components: 3:1 minimum
All elements must meet minimum ratio
```

### Integration Example

```javascript
// Pseudo-code for programmatic contrast checking
function checkContrast(foregroundColor, backgroundColor) {
  const fgLuminance = calculateRelativeLuminance(foregroundColor);
  const bgLuminance = calculateRelativeLuminance(backgroundColor);

  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

// Usage
const ratio = checkContrast('#333333', '#FFFFFF');
console.log(`Contrast ratio: ${ratio}:1`);
// Output: Contrast ratio: 12.6:1 ✓ (exceeds 4.5:1 requirement)
```

---

## 6. Keyboard Navigation Testing Contract

### Purpose
Verify all functionality is accessible via keyboard alone.

```typescript
interface KeyboardTestSession {
  timestamp: string;         // ISO 8601
  testerName: string;
  pageUrl: string;
  testMethod: 'Tab navigation' | 'Arrow keys' | 'Full keyboard';

  testResults: {
    allElementsReachable: boolean;
    focusOrderLogical: boolean;
    focusIndicatorsVisible: boolean;
    noKeyboardTraps: boolean;
    allFunctionalityAccessible: boolean;
    issuesFound: Array<{
      element: string;
      issue: string;
      severity: 'critical' | 'serious' | 'minor';
      steps: string;         // How to reproduce
    }>;
  };

  focusOrder: Array<{
    sequence: number;
    element: string;
    selector: string;
    isLogical: boolean;
  }>;

  passed: boolean;
}
```

### Test Procedure

```
Keyboard Navigation Audit

Setup:
1. Disable mouse or use keyboard-only mode
2. Open target page
3. Start from page top

Test Steps:
1. Press Tab - focus should move to first element
2. Continue Tab through all interactive elements
3. Verify focus order is logical (top→bottom, left→right)
4. For each element:
   - Is focus indicator visible?
   - Can you activate it? (Enter for links/buttons)
   - Does it do what expected?
5. Press Shift+Tab - focus should move backwards
6. Verify you can escape every component

Verification:
- [ ] All interactive elements reachable
- [ ] Focus order logical
- [ ] Focus indicators visible
- [ ] No elements trap focus
- [ ] All functionality works via keyboard
- [ ] No unexpected behavior
```

### Reporting Format
```json
{
  "tool": "Keyboard Testing",
  "timestamp": "2025-11-02T11:00:00Z",
  "results": {
    "allElementsReachable": true,
    "focusOrderLogical": true,
    "focusIndicatorsVisible": true,
    "noKeyboardTraps": true,
    "passed": true,
    "issuesFound": []
  }
}
```

---

## 7. W3C HTML Validator Contract

### Purpose
Validate HTML markup against W3C HTML specification.

### Interface

```typescript
interface ValidationResult {
  url: string;               // Validated URL
  isValid: boolean;          // No errors?
  documentType: string;      // e.g., "HTML 5"
  charset: string;           // e.g., "UTF-8"

  messages: Array<{
    type: 'error' | 'warning' | 'info';
    line: number;
    column: number;
    message: string;
    extract: string;         // Code snippet
    lastLine?: number;       // For multi-line issues
  }>;

  summary: {
    errors: number;
    warnings: number;
    totalMessages: number;
  };
}
```

### Expected Compliance Levels

#### For RGAA Conformance:
```
ERRORS: 0 (blocking - no errors allowed)
WARNINGS: Any number acceptable
```

### Integration Example

```javascript
// Using W3C Validator
async function validateHtml(pageUrl) {
  const validatorUrl = `https://validator.w3.org/nu/?doc=${encodeURIComponent(pageUrl)}&out=json`;

  const response = await fetch(validatorUrl);
  const results = await response.json();

  const errors = results.messages.filter(m => m.type === 'error');

  if (errors.length > 0) {
    throw new Error(`HTML validation failed: ${errors.length} errors found`);
  }

  return results;
}
```

---

## 8. CI/CD Integration Contract

### Purpose
Define how accessibility testing integrates into continuous integration and deployment.

```typescript
interface CicdAccessibilityPipeline {
  triggers: {
    onPullRequest: boolean;   // Run on every PR
    onCommit: boolean;        // Run on every commit
    preDeployment: boolean;   // Run before production deploy
    scheduled: string;        // e.g., "daily at 2am"
  };

  tests: Array<{
    name: string;            // e.g., "Axe Accessibility"
    tool: string;            // Tool name
    timeout: number;         // Seconds
    failureThreshold: {
      critical: 0;
      serious: 0;
      moderate: 5;
      minor: 10;
    };
  }>;

  reporting: {
    format: 'json' | 'html' | 'markdown';
    destination: string;    // Where to store results
    notifyOnFailure: boolean;
    slackChannel?: string;
  };

  blockDeploymentOn: {
    criticalIssues: true;
    seriousIssues: true;
    lowAccessibilityScore: boolean; // if score < 90
  };
}
```

### Example GitHub Actions Workflow

```yaml
name: Accessibility Testing

on:
  pull_request:
  push:
    branches: [main]

jobs:
  accessibility:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Install dependencies
        run: npm ci

      - name: Run Axe testing
        run: npm run test:axe

      - name: Run Lighthouse audit
        run: npm run test:lighthouse

      - name: Upload results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: accessibility-reports
          path: ./reports/

      - name: Comment PR with results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            // Post accessibility results as PR comment
```

---

## Testing Execution Order

### During Development
```
1. Local Axe testing (quick - 2 min)
2. Local keyboard testing (manual - 5 min)
3. Contrast checking (as needed)
```

### Before Commit
```
1. Run full Axe suite
2. Run Lighthouse audit
3. Verify keyboard navigation
4. Manual quick visual check
```

### In CI/CD Pipeline
```
1. Automated Axe testing (required - blocks if critical)
2. Automated Lighthouse audit (required - blocks if <90)
3. WAVE validation (required - blocks if errors)
4. W3C HTML validation (required - blocks if errors)
```

### Before Deployment
```
1. All CI/CD tests passing
2. Manual NVDA screen reader testing
3. Manual VoiceOver testing (if macOS available)
4. Full keyboard navigation audit
5. Final contrast verification
6. Accessibility audit report
```

---

## Success Criteria Summary

| Test | Tool | Target | Blocking |
|------|------|--------|----------|
| Critical Issues | Axe | 0 | Yes |
| Serious Issues | Axe | 0 | Yes |
| Accessibility Score | Lighthouse | 90+ | Yes |
| HTML Errors | W3C | 0 | Yes |
| WAVE Errors | WAVE | 0 | Yes |
| Contrast | Manual | 4.5:1 | Yes |
| Keyboard | Manual | 100% | Yes |
| Screen Readers | Manual | All working | Yes |

---

## Version History

| Version | Date | Status | Notes |
|---------|------|--------|-------|
| 1.0.0 | 2025-11-02 | Complete | Initial contracts defined |

