# Draw on Page with Excalidraw

A small Manifest V3 extension for Arc and other Chromium browsers. Click the extension or press a shortcut, draw directly over the visible page with the official [`@excalidraw/excalidraw`](https://www.npmjs.com/package/@excalidraw/excalidraw) package, then download a clean PNG.

## Install in Arc

1. Run:

   ```sh
   npm install
   npm run build
   ```

2. Open `arc://extensions` in Arc.
3. Turn on **Developer mode**.
4. Click **Load unpacked** and select this repository's `dist` folder.
5. Pin **Draw on Page with Excalidraw** if you want a visible toolbar button.

Click the extension button or press **Command + Shift + X** on macOS. Press **Escape** to close drawing mode. You can change the shortcut at `arc://extensions/shortcuts`.

## Use

1. Open the page you want to annotate.
2. Activate the extension.
3. Draw with the normal Excalidraw tools. The freehand tool starts selected in red.
4. Click **Save screenshot**. The extension briefly hides its controls and downloads a PNG containing the page and your drawing.

The overlay intentionally freezes the visible page at activation time, so animations and videos do not move underneath the drawing. Browser-internal pages such as `arc://extensions` cannot run extensions.

## Development

```sh
npm run typecheck
npm run build
npm run dev       # rebuild on changes
```

After rebuilding, click the extension's reload button on `arc://extensions` and refresh the page you are testing.
