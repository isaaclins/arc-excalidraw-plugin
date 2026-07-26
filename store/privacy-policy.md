# Privacy Policy for "Draw on Page with Excalidraw"

**Last updated: 26 July 2026**

## Short version

This extension collects nothing, sends nothing, and stores nothing about you. It runs
entirely inside your browser.

## What data is collected

None. There is no account, no sign-in, no server, no database, no analytics, no
telemetry, no crash reporting, no advertising and no third-party SDKs.

## What the extension does with page content

When you explicitly activate the extension on a tab (by clicking its toolbar button or
pressing its keyboard shortcut), it captures an image of that tab's visible area. That
image is used in two ways:

1. As a frozen backdrop so you can draw on a page that does not move underneath you.
2. As the base of the PNG you get when you press "Save screenshot".

Both happen locally in your browser. The image is passed to the browser's own download
manager (the `chrome.downloads` API), which writes the PNG to your normal downloads
folder. The extension never uploads, transmits, forwards, or copies that image anywhere
else, and it keeps no copy after the overlay is closed.

Your drawings live only in the open overlay. Closing the overlay discards them.

## Network activity

The extension makes no network requests. The Excalidraw editor, React, and all fonts are
bundled inside the extension package, so no remote code or remote asset is ever loaded.

## Permissions

- `activeTab`: temporary access to the tab you activated the extension on, so it can
  capture that tab and show the drawing overlay there. No other tab is touched.
- `scripting`: injects the bundled overlay script into that one tab, on demand.
- `downloads`: saves the finished PNG to your downloads folder.

No host permissions are requested, so the extension has no standing access to any
website.

## Data sharing and selling

There is no data, therefore nothing is shared, sold, or transferred to anyone, and
nothing is used for creditworthiness or lending purposes.

## Children

The extension is safe for all ages because it collects no data from anyone.

## Changes

If this policy ever changes, the updated version will be published at the same URL with a
new "last updated" date.

## Contact

Questions or reports: https://github.com/isaaclins/arc-excalidraw-plugin/issues
