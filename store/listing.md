# Chrome Web Store listing (copy/paste ready)

Everything in this file is meant to be pasted straight into the Chrome Web Store
developer dashboard for **Draw on Page with Excalidraw** v1.0.0.

---

## 1. Store listing tab

### Item title (max 75 chars)

```
Draw on Page with Excalidraw
```

### Short description / summary (max 132 chars)

```
Draw over any web page with Excalidraw, then save the page and your annotations as a clean PNG. Fully local, no accounts.
```

(121 characters.)

### Detailed description

```
Draw on Page turns any web page into a whiteboard. Press the toolbar button or a keyboard shortcut, and the full Excalidraw editor opens right on top of the page you are looking at. Sketch, circle, arrow, highlight, add text, then save everything as a single PNG.

WHAT IT DOES
- Opens the real Excalidraw editor as an overlay on the current tab
- Freezes the visible page at activation time, so videos, ads and animations stop moving underneath your drawing
- Freehand tool is pre-selected in red so you can start marking up immediately
- All the usual Excalidraw tools: rectangle, diamond, ellipse, arrow, line, text, eraser, laser pointer, images
- "Save screenshot" hides the extension controls, captures the visible tab, and downloads a PNG of the page with your drawing on top
- Escape closes the overlay and leaves the page untouched

TYPICAL USES
- Bug reports and design feedback with arrows and notes on the actual page
- Annotated screenshots for docs, tickets, PR reviews and support replies
- Explaining a layout or a data table to a colleague
- Teaching and demos, where you want to point at things live

KEYBOARD
- Command + Shift + X (macOS) or Ctrl + Shift + X (Windows, Linux) toggles drawing mode
- Escape closes the overlay
- The shortcut can be changed at chrome://extensions/shortcuts

PRIVACY
This extension collects nothing. There is no account, no sign-in, no server, no analytics and no tracking. Nothing is uploaded anywhere. The screenshot is created in your browser and handed to the browser's own download manager, so the PNG lands in your normal downloads folder and never leaves your device. The extension only becomes active on a tab when you explicitly click its button or press its shortcut.

NOTES AND LIMITATIONS
- Browser-internal pages (chrome://, arc://, the Web Store, other extensions' pages) cannot run extensions, so drawing is not available there
- The capture covers the visible viewport, not the full scrollable page
- Drawings are not saved between sessions; save the PNG if you want to keep them

OPEN SOURCE
Source code: https://github.com/isaaclins/arc-excalidraw-plugin (MIT licensed).
Built on the open-source @excalidraw/excalidraw package. This is an independent, community-built extension and is not affiliated with, endorsed by, or sponsored by the Excalidraw project or its maintainers.
```

### Category

Primary: **Productivity** (subcategory "Workflow & Planning" if asked).
Reasonable alternative: **Tools**. Productivity fits better because the item is an
annotation/screenshot utility, not a developer tool.

### Language

English (United States).

### Graphic assets in this folder

| Asset | File | Size | Required |
| --- | --- | --- | --- |
| Screenshot 1 | `store/screenshot-1-1280x800.png` | 1280x800 | Yes (min 1, max 5) |
| Small promo tile | `store/promo-tile-440x280.png` | 440x280 | Optional |
| Store icon | `public/icons/icon-128.png` | 128x128 | Yes (taken from the package) |

Screenshot caveat: `screenshot-1-1280x800.png` is built from
`store/raw-screenshot-github.png`, a real capture that unfortunately contained an
"Images are disabled." error dialog from an old bug. The dialog band was removed by
stitching the clean top and bottom regions of the capture together over a blurred
backdrop. It is honest and shows the real UI, but **retaking a fresh screenshot with an
actual drawing on the page is recommended before or shortly after launch** (draw
something visible, then screenshot the window at 1280x800 or 2560x1600).

The promo tile is icon-only on a light lilac background. If you want the extension name
on the tile, redo it in a design tool; ImageMagick and an ffmpeg build with `drawtext`
were not available on the build machine, so no text could be rendered.

---

## 2. Privacy tab

### Single purpose description

```
The single purpose of this extension is to let the user draw and annotate on top of the web page in the current tab and save the result as a PNG image on their own device.
```

### Permission justifications

**activeTab**

```
Used only after an explicit user gesture (clicking the extension's toolbar button or pressing its keyboard shortcut). It grants temporary access to the current tab so the extension can capture the visible tab as a PNG (chrome.tabs.captureVisibleTab) for the frozen backdrop and for the final saved image, and so it may inject the overlay into that one tab. Using activeTab avoids requesting broad host permissions: no site is accessed unless the user activates the extension on it.
```

**scripting**

```
Used to inject the drawing overlay into the current tab after the user activates the extension. chrome.scripting.executeScript inserts a small bundled script (bridge.js) that mounts an iframe containing the Excalidraw editor and relays messages between the page and the extension. It is injected only into the tab the user activated, only on demand, and only from files packaged in the extension. No remote code is fetched or executed.
```

**downloads**

```
Used solely to save the finished annotated image. When the user clicks "Save screenshot", the extension calls chrome.downloads.download with a locally generated data URL so the PNG is written to the user's normal downloads folder. Nothing is uploaded, and the permission is not used to read, search, or manage any other downloads.
```

**Host permissions**: none requested. `web_accessible_resources` is matched against
`<all_urls>` only so the extension's own overlay page and bundled Excalidraw assets can
load inside the iframe on whatever page the user activated it on; it grants the
extension no access to page data by itself.

**Remote code**

Select: **No, I am not using remote code.**
Everything (React, the Excalidraw editor, its fonts) is bundled into the package by
`npm run build`. The extension loads no external scripts, no CDNs, no `eval`, and makes
no network requests at runtime.

### Data usage declarations

Check **none** of the data categories. The correct answers are:

- Personally identifiable information: **No**
- Health information: **No**
- Financial and payment information: **No**
- Authentication information: **No**
- Personal communications: **No**
- Location: **No**
- Web history: **No**
- User activity (clicks, mouse position, keystroke logging): **No**
- Website content (text, images, sound, files): **No**
  (The page image never leaves the device: it is rendered in the tab and handed to the
  browser's download manager. Nothing is collected or transmitted, which is what this
  question asks about.)

Then tick all three certification boxes:

- I do not sell or transfer user data to third parties, outside of the approved use cases
- I do not use or transfer user data for purposes that are unrelated to my item's single purpose
- I do not use or transfer user data to determine creditworthiness or for lending purposes

### Privacy policy URL

```
https://isaaclins.com/arc-excalidraw-plugin/privacy
```

**Placeholder note:** this URL does not exist yet. Publish
`store/privacy-policy.html` at that path (or pick another public URL and update the
dashboard field plus this file) *before* submitting. Chrome Web Store requires the URL
to be publicly reachable at review time. A GitHub Pages or raw-file URL works as a
fallback, for example
`https://github.com/isaaclins/arc-excalidraw-plugin/blob/main/store/privacy-policy.md`.

---

## 3. Distribution tab

- Visibility: **Public** (or Unlisted first, if you want to test the live listing).
- Distribution: all regions.
- Pricing: free.
- "This item contains ads": **No**.

---

## 4. Naming / trademark note (read before submitting)

The title contains "Excalidraw", which is another project's name. Chrome Web Store brand
policy forbids titles that imply an affiliation or endorsement that does not exist.
Mitigations already applied: the detailed description ends with an explicit
"not affiliated with, endorsed by, or sponsored by the Excalidraw project" disclaimer.
If a reviewer still objects, the low-friction fix is to rename the item to something like
**"Draw on Page"** or **"Page Annotator"** and mention Excalidraw only in the body text
(`name` in `public/manifest.json`, then rebuild and re-upload). No code change is needed.
