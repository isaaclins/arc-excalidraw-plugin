(() => {
  if (globalThis.__arcDrawBridgeInstalled) return;
  globalThis.__arcDrawBridgeInstalled = true;

  const MESSAGE = {
    CLOSE: "arc-draw:close",
    INIT: "arc-draw:init",
    OPEN: "arc-draw:open",
    READY: "arc-draw:ready",
    STATE: "arc-draw:state",
  };

  let overlay = null;
  let screenshot = null;
  const overlayOrigin = new URL(chrome.runtime.getURL("overlay.html")).origin;

  function closeOverlay() {
    overlay?.remove();
    overlay = null;
    screenshot = null;
  }

  function sendScreenshot() {
    if (!overlay?.contentWindow || !screenshot) return;
    overlay.contentWindow.postMessage(
      { type: MESSAGE.INIT, screenshot },
      overlayOrigin,
    );
  }

  function openOverlay(nextScreenshot) {
    closeOverlay();
    screenshot = nextScreenshot;

    overlay = document.createElement("iframe");
    overlay.src = chrome.runtime.getURL("overlay.html");
    overlay.title = "Draw on this page with Excalidraw";
    overlay.setAttribute("aria-label", overlay.title);
    const styles = {
      background: "transparent",
      border: "0",
      height: "100vh",
      inset: "0",
      position: "fixed",
      width: "100vw",
      zIndex: "2147483647",
    };
    for (const [property, value] of Object.entries(styles)) {
      const cssProperty = property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
      overlay.style.setProperty(cssProperty, value, "important");
    }
    overlay.addEventListener("load", sendScreenshot, { once: true });
    document.documentElement.appendChild(overlay);
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === MESSAGE.STATE) {
      sendResponse({ open: Boolean(overlay?.isConnected) });
      return false;
    }

    if (message?.type === MESSAGE.CLOSE) {
      closeOverlay();
      sendResponse({ ok: true });
      return false;
    }

    if (message?.type === MESSAGE.OPEN && typeof message.screenshot === "string") {
      openOverlay(message.screenshot);
      sendResponse({ ok: true });
      return false;
    }

    return false;
  });

  window.addEventListener("message", (event) => {
    if (event.source !== overlay?.contentWindow || event.origin !== overlayOrigin) {
      return;
    }

    if (event.data?.type === MESSAGE.READY) sendScreenshot();
    if (event.data?.type === MESSAGE.CLOSE) closeOverlay();
  });
})();
