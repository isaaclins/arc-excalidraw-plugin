# Publishing runbook: Chrome Web Store

Everything a human needs to get **Draw on Page with Excalidraw** from this repo into the
Chrome Web Store, and to ship updates afterwards.

## 0. Before you start

- [ ] Host the privacy policy. Publish `store/privacy-policy.html` at
      `https://isaaclins.com/arc-excalidraw-plugin/privacy` (or any public URL) and note
      the final URL. The dashboard rejects unreachable privacy URLs.
- [ ] Decide on the item name. `store/listing.md` section 4 explains the "Excalidraw" in
      the title and the fallback if a reviewer objects.
- [ ] Optional but recommended: retake the store screenshot with a real drawing on the
      page (see the caveat in `store/listing.md`).

## 1. One-time developer account setup

1. Go to <https://chrome.google.com/webstore/devconsole> and sign in with the Google
   account that should own the item. This choice is effectively permanent, so use a
   long-lived account, not a throwaway.
2. Accept the developer agreement.
3. Pay the **one-time 5 USD registration fee**. It unlocks publishing for that account
   (up to 20 items).
4. Fill in the account-level **Contact email** and verify it. Publishing is blocked until
   the email is verified.
5. Optional: set a publisher display name (shown on the listing instead of your email).

## 2. Build the upload package

```sh
cd /Users/isaaclins/Projects/arc-excalidraw-plugin
./store/package.sh
```

This runs `npm run build` (typecheck + vite) and writes
`store/draw-on-page-excalidraw-v<version>.zip` with `manifest.json` at the zip root,
which is what the store requires. The zip is gitignored on purpose; it is a build
artifact.

Sanity check if you want: `unzip -l store/draw-on-page-excalidraw-v1.0.0.zip | head`.

## 3. Create the item and upload

1. Dashboard -> **Items** -> **Add new item**.
2. Upload the zip. If the manifest is malformed or the package contains disallowed
   files, the upload fails immediately with a specific message.
3. The dashboard opens the item's draft with the tabs described below.

## 4. Store listing tab

Copy the fields from `store/listing.md` section 1:

- Item title, short summary (max 132 chars), detailed description
- Category: Productivity
- Language: English (United States)
- Store icon: `public/icons/icon-128.png` (128x128)
- Screenshots: upload `store/screenshot-1-1280x800.png` (1280x800; at least one is
  required, up to five allowed)
- Small promo tile (optional): `store/promo-tile-440x280.png` (440x280)
- Support / homepage URL: `https://github.com/isaaclins/arc-excalidraw-plugin`

## 5. Privacy tab

Copy the blocks from `store/listing.md` section 2:

1. **Single purpose description**.
2. **Permission justifications** for `activeTab`, `scripting`, `downloads`. Every
   permission in the manifest gets its own text box; leaving one empty blocks submission.
3. **Remote code**: choose "No, I am not using remote code."
4. **Data usage**: tick nothing in the data-type list, then confirm the three
   certification checkboxes.
5. **Privacy policy URL**: the live URL from step 0.

## 6. Distribution tab

- Visibility **Public**, all regions, free, no ads. (Choose **Unlisted** first if you
  want to smoke-test the live listing before announcing it.)

## 7. Submit and wait

1. Click **Submit for review**. If a field is missing, the dashboard lists exactly which
   tab and field to fix.
2. Typical review time is a few hours to a few business days. Items using only
   `activeTab` with no host permissions and no remote code, like this one, are on the
   fast end.
3. Outcomes:
   - **Published**: the listing goes live at
     `https://chromewebstore.google.com/detail/<item-id>`; first-time developers can see
     an extra delay before the item is discoverable in search.
   - **Rejected**: the email names the policy clause. Fix, then resubmit the same item
     (no new 5 USD fee). Most likely causes here: unreachable privacy policy URL, weak
     permission justification, or the brand-name question in `listing.md` section 4.
4. Save the resulting **item ID** somewhere (README or this file), you need it for
   updates and for direct install links.

## 8. Shipping an update

1. Bump `"version"` in `public/manifest.json` (Semantic Versioning; the store rejects
   uploads whose version is not strictly higher than the published one). Keep
   `package.json` `version` in sync so the zip name matches.
2. Rebuild and repackage:
   ```sh
   ./store/package.sh
   ```
3. Dashboard -> the item -> **Package** -> **Upload new package** -> pick the new zip.
4. Update the listing text or screenshots if the change is user-visible.
5. **Submit for review** again. Updates go through review too, usually faster.
6. Users get the update automatically within a few hours of publication.

## 9. Things that will get you rejected (avoid)

- Adding host permissions (`<all_urls>`, `tabs`, `storage`) that the code does not
  actually use. Current permission set is minimal and fully used.
- Loading any script or font from a CDN. Everything must stay bundled.
- Screenshots that contain error dialogs, unrelated products, or misleading UI.
- A privacy policy that contradicts the data declarations.
- Keyword stuffing in the title or description.

## 10. Local files map

| File | Purpose |
| --- | --- |
| `store/listing.md` | All dashboard copy, ready to paste |
| `store/privacy-policy.md` | Privacy policy source of truth |
| `store/privacy-policy.html` | Hostable version for the public URL |
| `store/screenshot-1-1280x800.png` | Store screenshot |
| `store/promo-tile-440x280.png` | Optional small promo tile |
| `store/raw-screenshot-github.png` | Original capture the screenshot was made from |
| `store/package.sh` | Build + zip for upload |
| `store/PUBLISHING.md` | This runbook |
