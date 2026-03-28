# Design System Document: The Kinetic Ledger

## 1. Overview & Creative North Star
**Creative North Star: "Precision Brutalism"**

This design system rejects the "friendly" corporate aesthetics of traditional banking in favor of a high-performance, editorial-grade trading environment. It is built for the professional trader who demands clarity, speed, and a sense of institutional weight. 

To move beyond the generic "Dark Mode" template, this system utilizes **Intentional Asymmetry** and **Tonal Depth**. By breaking the rigid 12-column grid with overlapping elements and dramatic typography scales (e.g., using `display-lg` for volatile price data), we create a signature experience that feels like a bespoke financial terminal rather than a mobile app.

---

## 2. Colors & Surface Logic
The palette is rooted in absolute blacks and tactical ambers, utilizing a sophisticated Material-based tonal hierarchy.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section content. Boundaries must be defined solely through background color shifts. A `surface-container-low` section sitting on a `surface` background provides all the definition needed. If you feel the urge to draw a line, increase your padding instead.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of semi-translucent materials.
*   **Base:** `surface` (#131313)
*   **Low Importance:** `surface-container-low` (#1c1b1b)
*   **Active Cards:** `surface-container` (#201f1f)
*   **Floating/Elevated Elements:** `surface-container-highest` (#353534)

### The "Glass & Gradient" Rule
For primary CTAs and High-Yield indicators, use subtle linear gradients transitioning from `primary` (#ffb874) to `primary-container` (#f7931a). For floating modals, apply a `backdrop-blur` (12px to 20px) to semi-transparent surface colors to create a "Frosted Obsidian" effect.

---

## 3. Typography
We pair the technical, monospace-adjacent character of **Space Grotesk** with the neutral, high-legibility of **Inter** (replacing DM Sans for better variable weight support in fintech data).

*   **Display & Headlines (Space Grotesk):** Reserved for market prices, balance totals, and section headers. Its geometric tension conveys "The New Standard" of digital currency.
*   **Body & Labels (Inter):** Used for all functional data, descriptions, and metadata.
*   **Editorial Contrast:** Use `display-lg` for large numeric values alongside `label-sm` in `primary` for the currency ticker (e.g., "64,230.12 **BTC**"). This high-low contrast is the hallmark of premium editorial design.

---

## 4. Elevation & Depth
In this system, depth is a product of light and material, not drop-shadow presets.

*   **The Layering Principle:** Achieve hierarchy by "stacking." A `surface-container-lowest` chart module placed inside a `surface-container-low` dashboard section creates a recessed, "etched" look that feels more premium than a raised card.
*   **Ambient Shadows:** When an element must float (e.g., a Trade Confirmation sheet), use an ultra-diffused shadow:
    *   *Y: 24px, Blur: 48px, Color: `on-background` at 4% opacity.*
*   **The "Ghost Border" Fallback:** If accessibility requires a container edge, use the `outline-variant` token at **15% opacity**. This provides a "shimmer" rather than a hard line.

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary-container` (#f7931a) with `on-primary-container` text. 12px (`md`) radius.
*   **Secondary:** Ghost style. Transparent background with a `ghost-border` (15% opacity `outline-variant`).
*   **Tertiary:** Text-only in `primary` color for low-priority actions like "View History."

### Input Fields
Forbid the "boxed" look. Use a `surface-container-low` background with a bottom-only `outline-variant` shimmer. Labels should use `label-sm` and sit 4px above the input area to maintain a compact, high-density layout.

### Value Chips (Profit/Loss)
*   **Success:** `secondary-container` (#00b954) background with `on-secondary-fixed` text.
*   **Loss:** `tertiary-container` (#ff8982) background with `on-tertiary-fixed` text.
*   **Design Note:** Use a 4px (`sm`) radius for chips to contrast against the 12px card corners, signaling they are "data points" rather than "containers."

### Cards & Lists
**Strict Rule:** No dividers. Use `spacing-6` (1.3rem) of vertical white space to separate list items. If the list is dense, alternate background colors between `surface` and `surface-container-low` (Zebra striping) rather than using lines.

### Specialized Component: The "Market Tape"
A horizontal scrolling ticker at the very top of the viewport using `surface-container-lowest` and `label-sm` typography. This provides a constant sense of "live" movement without cluttering the main dashboard.

---

## 6. Do's and Don'ts

### Do
*   **Do** use `primary` orange sparingly. It is a "call to arms," not a decorative element.
*   **Do** lean into `150ms` ease-out transitions for all hover states to make the app feel responsive and "mechanical."
*   **Do** use Lucide icons with a `1.5px` stroke; the thinner line weight complements the geometric nature of Space Grotesk.

### Don't
*   **Don't** use pure white (#ffffff) for text. Always use `on-surface` (#e5e2e1) to reduce eye strain in dark environments.
*   **Don't** use "Drop Shadows" on cards that are sitting on the base background. Use tonal shifts.
*   **Don't** use standard 16px padding. Use the provided scale (e.g., `spacing-5` or `spacing-8`) to create intentional, breathable asymmetry.