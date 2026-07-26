const MESSAGE = {
  CAPTURE: "arc-draw:capture",
  CLOSE: "arc-draw:close",
  OPEN: "arc-draw:open",
  STATE: "arc-draw:state",
};

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function sendToTab(tabId, message) {
  try {
    return await chrome.tabs.sendMessage(tabId, message);
  } catch {
    return null;
  }
}

async function showError(tabId) {
  await chrome.action.setBadgeBackgroundColor({ tabId, color: "#e03131" });
  await chrome.action.setBadgeText({ tabId, text: "!" });
  setTimeout(() => chrome.action.setBadgeText({ tabId, text: "" }), 2500);
}

async function toggleDrawing() {
  const tab = await getCurrentTab();
  if (!tab?.id || tab.windowId === undefined) return;

  const state = await sendToTab(tab.id, { type: MESSAGE.STATE });
  if (state?.open) {
    await sendToTab(tab.id, { type: MESSAGE.CLOSE });
    return;
  }

  try {
    const screenshot = await chrome.tabs.captureVisibleTab(tab.windowId, {
      format: "png",
    });

    if (!state) {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["bridge.js"],
      });
    }

    await sendToTab(tab.id, { type: MESSAGE.OPEN, screenshot });
  } catch (error) {
    console.error("Could not start Draw on Page", error);
    await showError(tab.id);
  }
}

chrome.action.onClicked.addListener(toggleDrawing);
chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-drawing") void toggleDrawing();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== MESSAGE.CAPTURE) return false;

  const overlayUrl = chrome.runtime.getURL("overlay.html");
  if (sender.id !== chrome.runtime.id || !sender.url?.startsWith(overlayUrl)) {
    sendResponse({ ok: false, error: "Untrusted capture request" });
    return false;
  }

  void (async () => {
    try {
      const tab = sender.tab ?? (await getCurrentTab());
      if (!tab?.id || tab.windowId === undefined) {
        throw new Error("No active tab found");
      }

      const screenshot = await chrome.tabs.captureVisibleTab(tab.windowId, {
        format: "png",
      });
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

      await chrome.downloads.download({
        url: screenshot,
        filename: `excalidraw-page-${timestamp}.png`,
        saveAs: false,
      });
      sendResponse({ ok: true });
    } catch (error) {
      console.error("Could not save Draw on Page screenshot", error);
      sendResponse({
        ok: false,
        error: error instanceof Error ? error.message : "Screenshot failed",
      });
    }
  })();

  return true;
});
