# RGAA 4.1 Accessibility Research & Implementation Guide

**Created**: 2025-11-02
**Status**: Reference Document
**Purpose**: Deep-dive research into RGAA 4.1 compliance requirements with practical implementation guidance

---

## RGAA Overview

### What is RGAA?

**RGAA** (Référentiel Général d'Amélioration de l'Accessibilité) is France's official digital accessibility framework. RGAA 4.1 is the current version and is fully aligned with WCAG 2.1 Level AA standards.

**Key Facts**:
- Mandatory for all French public websites and related services
- Aligns perfectly with WCAG 2.1 Level AA
- Based on international Web Content Accessibility Guidelines
- 107 specific criteria across 13 topics
- Can be verified through automated and manual testing

### RGAA vs. WCAG

| Aspect | RGAA | WCAG |
|--------|------|------|
| Origin | French government (DISIC) | International (W3C) |
| Scope | French public digital services | All websites globally |
| Level | AA equivalent | A, AA, AAA levels |
| Language | French | English, many translations |
| Adoption | Mandatory in France | Best practice globally |
| Testing | Specific French methodology | Generic testing approach |

---

## The 13 RGAA Topics

### Topic 1: Images

**Focus**: All images must have text alternatives that serve the same purpose as the image.

#### Key Requirements:
1. **Informative Images**: Must have alt text describing the image purpose
   - Example: `<img alt="Profile picture of John Doe" src="john.jpg" />`

2. **Decorative Images**: Must be hidden from assistive technologies
   - Use: `<img alt="" src="decoration.jpg" />` (empty alt)
   - Or: `<svg aria-hidden="true">...</svg>`

3. **Complex Images**: May need `longdesc`, adjacent text description, or ARIA-describedby

4. **Text in Images**: Should be replaced with actual text whenever possible
   - If unavoidable, text must be in alt text

#### Testing for Topic 1:
```html
<!-- ✓ GOOD: Profile picture with alt text -->
<img alt="Profile picture of Leo Brival, full-stack developer" src="avatar.jpg" />

<!-- ✓ GOOD: Decorative icon hidden -->
<svg aria-hidden="true" role="presentation">...</svg>

<!-- ✗ BAD: Missing alt text -->
<img src="profile.jpg" />

<!-- ✗ BAD: Vague alt text -->
<img alt="image" src="photo.jpg" />
```

#### Implementation Tips:
- Alt text should be descriptive but concise (target: 80 characters max)
- For profile pictures: "[Name]'s profile picture" or "[Name], [title/description]"
- Don't repeat caption text in alt attribute
- Use empty alt="" for purely decorative images
- Test with screen readers (NVDA, JAWS) to verify announcements

---

### Topic 3: Colors & Contrast

**Focus**: Color alone cannot be the only way information is conveyed. Text and UI components must have sufficient contrast.

#### Key Requirements:

1. **Text Contrast**: 4.5:1 for normal text, 3:1 for large text
   - Normal text: ≤ 18px (or ≤ 14px bold)
   - Large text: ≥ 18px (or ≥ 14px bold)
   - Formula: (Lighter color luminance + 0.05) / (Darker color luminance + 0.05)

2. **UI Component Contrast**: 3:1 minimum
   - Focus indicators must contrast with background
   - Button borders, input fields, etc.
   - Adjacent colors that distinguish components

3. **No Color Alone**:
   - Links must be distinguished by underline or other means, not color alone
   - Status indicators: use icon + color, not color alone
   - Form errors: use text label + visual indicator

#### Common Contrast Ratios:
```
White (#FFFFFF) on Black (#000000)         = 21:1  ✓ AAA
Black (#000000) on White (#FFFFFF)         = 21:1  ✓ AAA
Dark Gray (#333333) on White (#FFFFFF)     = 12.6:1 ✓ AAA
Dark Blue (#003366) on White (#FFFFFF)     = 8.6:1  ✓ AAA
Blue (#0066CC) on White (#FFFFFF)          = 5.2:1  ✓ AA
Light Gray (#CCCCCC) on White (#FFFFFF)    = 1.2:1  ✗ FAIL

Normal text needs: 4.5:1 minimum
Large text needs:  3:1 minimum
UI components:     3:1 minimum
```

#### Testing for Topic 3:

**Automated Tools**:
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Axe DevTools (Chrome extension)
- WAVE extension
- Lighthouse (built into Chrome)

**Manual Testing**:
1. Screenshot the page
2. Use color picker to get exact colors
3. Calculate contrast ratio
4. Verify information conveyed by color has alternative indicator

#### Implementation Tips:
```css
/* ✓ GOOD: Sufficient contrast with custom focus */
a {
  color: #0066CC;        /* 5.2:1 contrast on white */
  text-decoration: underline;  /* Multiple indicators */
}

a:focus {
  outline: 2px solid #333;     /* High contrast focus indicator */
  outline-offset: 2px;
}

/* ✓ GOOD: Respect user preferences */
@media (prefers-color-scheme: dark) {
  body {
    background: #1a1a1a;
    color: #f0f0f0;        /* Maintain 4.5:1 contrast */
  }
}

@media (prefers-contrast: more) {
  /* Enhance contrast for Windows High Contrast mode */
  a {
    color: #0033AA;        /* More saturated blue */
  }
}

/* ✓ GOOD: Animations respect preference */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

---

### Topic 7: Keyboard Navigation & Focus

**Focus**: All functionality must be accessible via keyboard alone. Users must be able to navigate and activate all interactive elements without a mouse.

#### Key Requirements:

1. **Keyboard Access**: All interactive elements (links, buttons, form inputs) must be accessible via Tab/Shift+Tab
2. **Logical Focus Order**: Focus must move in a logical order (typically top-to-bottom, left-to-right)
3. **Visible Focus Indicator**: Focused element must have visible indicator (outline, highlight, etc.)
4. **No Keyboard Traps**: User must not get stuck in any element
5. **Keyboard Shortcuts**: If implemented, must not conflict with browser/OS shortcuts

#### Testing for Topic 7:

```
Tab through entire page and verify:
1. Focus moves to all interactive elements
2. Order is logical
3. Indicator is visible at each step
4. Can exit every element with Tab/Shift+Tab
5. All functionality accessible
```

#### Implementation Tips:

```html
<!-- ✓ GOOD: Semantic HTML provides keyboard access -->
<a href="https://example.com">Click me</a>
<button type="button">Click me</button>
<input type="text" />

<!-- ✓ GOOD: Visible focus indicator -->
<style>
  a:focus, button:focus, input:focus {
    outline: 2px solid #333;
    outline-offset: 2px;
  }
</style>

<!-- ✓ GOOD: Logical tab order with tabindex -->
<input tabindex="0" />  <!-- First -->
<button tabindex="0" /> <!-- Second -->
<a tabindex="0">Link</a> <!-- Third -->

<!-- ✗ BAD: Custom element without keyboard support -->
<div onclick="doSomething()">Click me</div>

<!-- ✓ GOOD: Custom element with keyboard support -->
<div
  role="button"
  tabindex="0"
  @click="doSomething()"
  @keydown.enter="doSomething()"
  @keydown.space="doSomething()"
>
  Click me
</div>

<!-- ✗ BAD: Hidden focus indicator -->
<style>
  a:focus { outline: none; }  /* NEVER DO THIS */
</style>

<!-- ✓ GOOD: Custom focus style -->
<style>
  a:focus {
    outline: 2px solid #0066CC;
    outline-offset: 2px;
    background-color: #E8F0FF;
  }
</style>
```

---

### Topic 9: Semantic HTML & Structure

**Focus**: Page structure must be conveyed through proper semantic HTML elements that work with assistive technologies.

#### Key Requirements:

1. **Valid HTML**: No syntax errors that break parsing
2. **Proper Landmarks**:
   - `<header>` or `role="banner"` for page header
   - `<nav>` or `role="navigation"` for navigation
   - `<main>` or `role="main"` for main content
   - `<footer>` or `role="contentinfo"` for footer
3. **Heading Hierarchy**:
   - Exactly one H1 per page
   - Proper nesting (H1 → H2 → H3, no skipping)
   - Headings describe content they precede
4. **Language Declaration**: `<html lang="fr">` for French content

#### Implementation Tips:

```html
<!-- ✓ GOOD: Proper semantic structure -->
<html lang="fr">
  <head>
    <title>Leo Brival's Linktree | Links & Social</title>
  </head>
  <body>
    <header role="banner">
      <h1>Leo Brival's Links</h1>
      <p>Full-stack developer, open source enthusiast</p>
    </header>

    <main role="main">
      <section>
        <h2>My Links</h2>
        <ul>
          <li><a href="...">GitHub</a></li>
          <li><a href="...">Twitter</a></li>
        </ul>
      </section>
    </main>

    <footer role="contentinfo">
      <p>&copy; 2025 Leo Brival</p>
    </footer>
  </body>
</html>

<!-- ✓ GOOD: Heading hierarchy -->
<h1>Page Title</h1>           <!-- Main topic -->
  <h2>Section</h2>            <!-- Subtopic -->
    <h3>Subsection</h3>       <!-- Sub-subtopic -->
    <h3>Another subsection</h3> <!-- Sibling -->
  <h2>Another Section</h2>    <!-- Back to section level -->

<!-- ✗ BAD: Skipped heading levels -->
<h1>Title</h1>
  <h3>Subsection</h3>         <!-- Wrong: should be H2 -->

<!-- ✗ BAD: Multiple H1s -->
<h1>Page Title</h1>
<h1>Another Title</h1>        <!-- Wrong: should be H2+ -->

<!-- ✗ BAD: H1 for styling -->
<h1 style="font-size: 14px;">This looks like body text</h1>
```

---

### Topic 10: Forms & Labels

**Focus**: Form inputs must have associated labels so users know what to enter.

#### Key Requirements:

1. **Label Association**:
   - Use `<label for="input-id">` linked to `<input id="input-id" />`
   - Or use ARIA: `aria-label="field name"`
   - Or use ARIA: `aria-labelledby="label-id"`

2. **Label Content**: Label must clearly describe the input purpose

3. **Visual Proximity**: Label must be positioned near its input

4. **Error Messages**: Error messages must identify the field and explain the issue

#### Implementation Tips:

```html
<!-- ✓ GOOD: Proper label association -->
<label for="email">Email address</label>
<input id="email" type="email" />

<!-- ✓ GOOD: ARIA label for icon button -->
<button aria-label="Close menu">
  <svg>...</svg>
</button>

<!-- ✓ GOOD: Error message with label -->
<label for="age">Age (18+)</label>
<input id="age" type="number" />
<span id="age-error" class="error">Age must be at least 18</span>

<!-- ✓ GOOD: ARIA describedby for help text -->
<label for="password">Password</label>
<input
  id="password"
  type="password"
  aria-describedby="pwd-help"
/>
<span id="pwd-help">Must contain at least 8 characters</span>

<!-- ✗ BAD: No label -->
<input type="text" />

<!-- ✗ BAD: Incorrect label association -->
<label>Email</label>
<input type="email" />  <!-- Not connected -->

<!-- ✗ BAD: Vague label -->
<label for="field1">Field 1</label>
<input id="field1" />
```

---

## RGAA Compliance Testing Methodology

### Phase 1: Preparation (1-2 hours)
1. Gather requirements and success criteria
2. Assemble testing tools
3. Define scope (which pages, components)
4. Plan testing schedule

### Phase 2: Automated Testing (30 minutes)
1. Run Axe DevTools on each page
2. Run Lighthouse accessibility audit
3. Run WAVE validation
4. Document any issues found
5. Note: Automated tools catch ~50% of issues

### Phase 3: Manual Testing (2-4 hours)
1. **Screen Reader Testing**:
   - Use NVDA or JAWS (Windows) or VoiceOver (macOS)
   - Navigate entire page
   - Verify all content announced correctly
   - Check heading structure
   - Verify landmark announcements

2. **Keyboard Testing**:
   - Unplug mouse
   - Tab through all elements
   - Verify logical focus order
   - Check focus indicators visible
   - Activate all interactive elements

3. **Visual Testing**:
   - Check color contrast with WebAIM Contrast Checker
   - Enable Windows High Contrast mode
   - Test at 200% zoom
   - Test on mobile (320px width)
   - Check for text truncation

4. **Cognitive Testing**:
   - Read content for clarity
   - Verify instructions are simple
   - Check consistency of patterns
   - Test with multiple types of content

### Phase 4: Issue Documentation (1 hour)
1. Log all issues found
2. Assign severity (critical, serious, minor)
3. Document reproduction steps
4. Suggest remediation
5. Assign to developers

### Phase 5: Remediation (varies)
1. Developers fix issues
2. QA verifies fixes
3. Re-test with original testing method
4. Close issues

### Phase 6: Final Audit (1-2 hours)
1. Complete full testing cycle again
2. Verify all issues resolved
3. Run automated tests
4. Final manual testing
5. Generate compliance report

---

## Common Accessibility Mistakes in Linktree-Style Sites

### 1. Profile Picture Without Alt Text
```html
<!-- ✗ BAD -->
<img src="avatar.jpg" />

<!-- ✓ GOOD -->
<img alt="Profile picture of Leo Brival" src="avatar.jpg" />
```

### 2. Links Without Clear Purpose
```html
<!-- ✗ BAD: "Click here" doesn't describe where link goes -->
<a href="https://github.com/leobrival">Click here for GitHub</a>

<!-- ✓ GOOD: Link text alone describes destination -->
<a href="https://github.com/leobrival">GitHub Profile</a>
```

### 3. Insufficient Color Contrast
```css
/* ✗ BAD: Light gray on white (1.5:1) */
a {
  color: #CCCCCC;        /* Not enough contrast */
}

/* ✓ GOOD: Dark color on white (4.5:1+) */
a {
  color: #0066CC;        /* Sufficient contrast */
}
```

### 4. No Focus Indicator
```css
/* ✗ BAD: Invisible focus */
a:focus {
  outline: none;         /* NEVER remove outline */
}

/* ✓ GOOD: Visible focus indicator */
a:focus {
  outline: 2px solid #333;
  outline-offset: 2px;
}
```

### 5. Non-Semantic HTML
```html
<!-- ✗ BAD: Divs instead of semantic elements -->
<div class="header">...</div>
<div class="nav">...</div>
<div class="main">...</div>

<!-- ✓ GOOD: Semantic HTML -->
<header></header>
<nav></nav>
<main></main>
```

### 6. Animations Not Respecting Preferences
```css
/* ✗ BAD: Animation always plays */
.fade-in {
  animation: fadeIn 2s;
}

/* ✓ GOOD: Respect user preference */
.fade-in {
  animation: fadeIn 2s;
}

@media (prefers-reduced-motion: reduce) {
  .fade-in {
    animation: none;
  }
}
```

### 7. No Language Declaration
```html
<!-- ✗ BAD: No language declared -->
<html>
  <head>...</head>
</html>

<!-- ✓ GOOD: Language declared -->
<html lang="fr">
  <head>...</head>
</html>

<!-- ✓ GOOD: Mixed language -->
<html lang="fr">
  <body>
    French content here
    <p lang="en">Some English text</p>
  </body>
</html>
```

---

## RGAA Compliance Checklist Quick Reference

### Must-Haves (Critical)
- [ ] All images have appropriate alt text
- [ ] Text contrast 4.5:1 (normal) / 3:1 (large)
- [ ] All interactive elements keyboard accessible
- [ ] Visible focus indicators on all elements
- [ ] Semantic HTML with proper landmarks
- [ ] Heading hierarchy with single H1
- [ ] Form labels associated with inputs
- [ ] Language declared as "fr"

### Should-Haves (Important)
- [ ] Respect prefers-reduced-motion
- [ ] Respect prefers-color-scheme
- [ ] Support 200% zoom without overflow
- [ ] Touch targets 44x44px minimum
- [ ] Simple, clear language
- [ ] Consistent navigation patterns
- [ ] Error messages clearly identify field

### Nice-to-Haves (Recommended)
- [ ] ARIA attributes for complex components
- [ ] Skip links for keyboard users
- [ ] Accessibility statement page
- [ ] Continuous accessibility testing

---

## Tools & Resources

### Automated Testing Tools
- **Axe DevTools** (Free): https://www.deque.com/axe/devtools/
- **Lighthouse** (Built-in): Chrome DevTools
- **WAVE** (Free): https://wave.webaim.org/
- **ADEPT** (Free): https://www.achecker.ca/

### Screen Readers (Testing)
- **NVDA** (Free): https://www.nvaccess.org/
- **JAWS** (Paid): https://www.freedomscientific.com/products/software/jaws/
- **VoiceOver** (Free): Built into macOS/iOS
- **TalkBack** (Free): Built into Android

### Contrast Checking
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Color Contrast Analyzer**: https://www.tpgi.com/color-contrast-checker/
- **Axe Color Contrast Checker**: Chrome extension

### Validation
- **W3C HTML Validator**: https://validator.w3.org/
- **W3C CSS Validator**: https://jigsaw.w3.org/css-validator/

### Documentation
- **RGAA Official** (French): https://www.numerique.gouv.fr/publications/rgaa-accessibilite/
- **WCAG 2.1** (English): https://www.w3.org/WAI/WCAG21/quickref/
- **WAI-ARIA Authoring Practices**: https://www.w3.org/WAI/ARIA/apg/
- **WebAIM Articles**: https://webaim.org/

---

## Questions & Answers

### Q: Does RGAA AA require AAA compliance?
**A**: No. RGAA 4.1 is equivalent to WCAG 2.1 Level AA. AAA is optional and recommended for extra accessibility.

### Q: How often should I test accessibility?
**A**: Ideally on every commit, minimally before each release. Re-test when making design/code changes.

### Q: Which screen reader is most important to test with?
**A**: NVDA (free, Windows). Then test with VoiceOver (free, macOS/iOS) for broader coverage.

### Q: What if I can't achieve 4.5:1 contrast?
**A**: Redesign. Make text larger or adjust colors. Contrast is non-negotiable for accessibility.

### Q: Can I remove the focus outline?
**A**: Never. Keyboard users rely on focus indicators. You must provide a visible alternative if you customize.

### Q: What's the difference between alt="" and aria-hidden="true"?
**A**: Both hide from screen readers. Use alt="" for images, aria-hidden="true" for decorative elements.

---

## Implementation Timeline

### Week 1: Planning & Testing
- [ ] Set up testing tools
- [ ] Run automated tests
- [ ] Document baseline compliance
- [ ] Plan issue remediation

### Week 2-3: Core Accessibility
- [ ] Implement semantic HTML
- [ ] Add/fix alt text
- [ ] Ensure keyboard navigation
- [ ] Add visible focus indicators

### Week 4: Polish & Testing
- [ ] Fix color contrast issues
- [ ] Implement animations respecting preferences
- [ ] Screen reader testing
- [ ] Final verification

### Week 5: Launch
- [ ] Final automated tests
- [ ] Manual testing with real assistive tech
- [ ] Deploy with confidence
- [ ] Monitor for issues

---

## Success Indicators

✓ **Baseline**: 70% automated test pass rate
✓ **Good**: 90% automated + successful manual testing
✓ **Excellent**: 100% automated + 100% manual + all WCAG AA criteria met
✓ **Expert**: Full WCAG AAA + accessibility monitoring in place

---

## References

1. RGAA 4.1 Documentation: https://www.numerique.gouv.fr/publications/rgaa-accessibilite/
2. WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
3. WebAIM: https://webaim.org/
4. The A11Y Project: https://www.a11yproject.com/
5. Deque Systems: https://www.deque.com/
6. TPGI Accessibility Resources: https://www.tpgi.com/
