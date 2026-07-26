import { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Excalidraw } from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import "@excalidraw/excalidraw/index.css";
import "./overlay.css";

const MESSAGE = {
  CAPTURE: "arc-draw:capture",
  CLOSE: "arc-draw:close",
  INIT: "arc-draw:init",
  READY: "arc-draw:ready",
} as const;

type CaptureResponse = { ok: true } | { ok: false; error?: string };

function nextPaint() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

function DrawingOverlay() {
  const [api, setApi] = useState<ExcalidrawImperativeAPI | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);

  const close = useCallback(() => {
    window.parent.postMessage({ type: MESSAGE.CLOSE }, "*");
  }, []);

  useEffect(() => {
    const receiveScreenshot = (event: MessageEvent) => {
      if (event.source !== window.parent) return;
      if (event.data?.type !== MESSAGE.INIT) return;
      if (typeof event.data.screenshot !== "string") return;
      setScreenshot(event.data.screenshot);
    };

    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      close();
    };

    window.addEventListener("message", receiveScreenshot);
    window.addEventListener("keydown", closeWithEscape, true);
    window.parent.postMessage({ type: MESSAGE.READY }, "*");

    return () => {
      window.removeEventListener("message", receiveScreenshot);
      window.removeEventListener("keydown", closeWithEscape, true);
    };
  }, [close]);

  const saveScreenshot = useCallback(async () => {
    setError("");
    api?.updateScene({
      appState: {
        editingGroupId: null,
        selectedElementIds: {},
        selectedGroupIds: {},
        selectedLinearElement: null,
      },
    });
    setCapturing(true);
    await nextPaint();

    try {
      const response = (await chrome.runtime.sendMessage({
        type: MESSAGE.CAPTURE,
      })) as CaptureResponse;

      if (!response?.ok) {
        throw new Error(response?.error || "Could not save the screenshot");
      }
    } catch (captureError) {
      setError(
        captureError instanceof Error
          ? captureError.message
          : "Could not save the screenshot",
      );
    } finally {
      setCapturing(false);
    }
  }, [api]);

  return (
    <main className={`arc-draw ${capturing ? "arc-draw--capturing" : ""}`}>
      {screenshot ? (
        <img
          className="arc-draw__page"
          src={screenshot}
          alt=""
          draggable={false}
        />
      ) : (
        <div className="arc-draw__loading">Preparing canvas…</div>
      )}

      <div className="arc-draw__editor">
        <Excalidraw
          excalidrawAPI={(excalidrawApi) => {
            setApi(excalidrawApi);
            excalidrawApi.setActiveTool({ type: "freedraw" });
          }}
          initialData={{
            appState: {
              currentItemStrokeColor: "#e03131",
              currentItemStrokeWidth: 2,
              viewBackgroundColor: "transparent",
            },
          }}
          UIOptions={{
            canvasActions: {
              changeViewBackgroundColor: false,
              export: false,
              loadScene: false,
              saveAsImage: false,
              saveToActiveFile: false,
              toggleTheme: false,
            },
            tools: { image: true },
          }}
        />
      </div>

      <div className="arc-draw__controls" role="toolbar" aria-label="Screenshot controls">
        <span className="arc-draw__hint">Draw, then save</span>
        <button
          className="arc-draw__button arc-draw__button--primary"
          type="button"
          onClick={saveScreenshot}
          disabled={capturing || !screenshot}
        >
          Save screenshot
        </button>
        <button
          className="arc-draw__button arc-draw__button--close"
          type="button"
          onClick={close}
          aria-label="Close drawing mode"
          title="Close (Escape)"
        >
          ×
        </button>
      </div>

      {error && <div className="arc-draw__error">{error}</div>}
    </main>
  );
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Missing overlay root");
createRoot(rootElement).render(<DrawingOverlay />);
