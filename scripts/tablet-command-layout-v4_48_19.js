(function () {
  "use strict";

  if (window.__SYS_V44819_TABLET_COMMAND_FIX__) return;
  window.__SYS_V44819_TABLET_COMMAND_FIX__ = true;

  const STYLE_ID = "sys-v44819-tablet-command-layout";
  const ROOT_CLASS = "sys-v44819-tablet-layout";

  function installStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      html.${ROOT_CLASS},
      html.${ROOT_CLASS} body {
        width: 100% !important;
        min-height: 100% !important;
        height: 100% !important;
        margin: 0 !important;
        overflow: hidden !important;
      }

      html.${ROOT_CLASS} body {
        min-height: -webkit-fill-available !important;
      }

      html.${ROOT_CLASS} .app,
      html.${ROOT_CLASS} #app {
        min-height: 100vh !important;
        min-height: -webkit-fill-available !important;
        height: var(--sys-visible-height, 100vh) !important;
        max-height: var(--sys-visible-height, 100vh) !important;
        overflow: hidden !important;
      }

      html.${ROOT_CLASS} .main {
        height: var(--sys-visible-height, 100vh) !important;
        min-height: 0 !important;
        max-height: var(--sys-visible-height, 100vh) !important;
        display: flex !important;
        flex-direction: column !important;
        overflow: hidden !important;
      }

      html.${ROOT_CLASS} .content-scroll,
      html.${ROOT_CLASS} main,
      html.${ROOT_CLASS} .main-content {
        min-height: 0 !important;
      }

      html.${ROOT_CLASS} .content-scroll {
        flex: 1 1 auto !important;
        height: auto !important;
        overflow: auto !important;
        overscroll-behavior: contain;
        padding-bottom: max(8px, env(safe-area-inset-bottom, 0px)) !important;
      }

      html.${ROOT_CLASS} #screen-command {
        min-height: 0 !important;
        height: 100% !important;
        margin-bottom: 0 !important;
        padding-bottom: 0 !important;
      }

      html.${ROOT_CLASS} #screen-command.active {
        display: flex !important;
        flex-direction: column !important;
      }

      html.${ROOT_CLASS} #screen-command .command-dashboard,
      html.${ROOT_CLASS} #screen-command .command-layout,
      html.${ROOT_CLASS} #screen-command .command-shell {
        min-height: 0 !important;
        height: 100% !important;
        flex: 1 1 auto !important;
        align-items: stretch !important;
        margin-bottom: 0 !important;
      }

      html.${ROOT_CLASS} #screen-command .command-main-column,
      html.${ROOT_CLASS} #screen-command .command-side-column {
        min-height: 0 !important;
        height: 100% !important;
        align-content: stretch !important;
      }

      html.${ROOT_CLASS} #screen-command .command-main-column > *,
      html.${ROOT_CLASS} #screen-command .command-side-column > * {
        min-height: 0;
      }

      @media (min-width: 768px) {
        html.${ROOT_CLASS} #screen-command .command-dashboard,
        html.${ROOT_CLASS} #screen-command .command-layout,
        html.${ROOT_CLASS} #screen-command .command-shell {
          display: grid !important;
          grid-auto-rows: minmax(0, 1fr);
        }
      }

      @media (orientation: landscape) and (min-width: 900px) {
        html.${ROOT_CLASS} .content-scroll {
          overflow: hidden !important;
        }

        html.${ROOT_CLASS} #screen-command {
          overflow: hidden !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function visibleHeight() {
    const viewport = window.visualViewport;
    const height = viewport && viewport.height
      ? Math.round(viewport.height)
      : Math.round(window.innerHeight || document.documentElement.clientHeight);
    return Math.max(320, height);
  }

  let lastHeight = 0;
  let frame = 0;

  function applyVisibleHeight() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const height = visibleHeight();
      if (Math.abs(height - lastHeight) < 2) return;
      lastHeight = height;
      document.documentElement.style.setProperty("--sys-visible-height", `${height}px`);
    });
  }

  function activate() {
    document.documentElement.classList.add(ROOT_CLASS);
    installStyles();
    applyVisibleHeight();

    const viewport = window.visualViewport;
    if (viewport) {
      viewport.addEventListener("resize", applyVisibleHeight, { passive: true });
      viewport.addEventListener("scroll", applyVisibleHeight, { passive: true });
    }

    window.addEventListener("resize", applyVisibleHeight, { passive: true });
    window.addEventListener("orientationchange", () => {
      setTimeout(applyVisibleHeight, 80);
      setTimeout(applyVisibleHeight, 350);
    }, { passive: true });

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) setTimeout(applyVisibleHeight, 60);
    });

    const observer = new MutationObserver(() => {
      const command = document.getElementById("screen-command");
      if (command && command.classList.contains("active")) applyVisibleHeight();
    });
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["class"] });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", activate, { once: true });
  } else {
    activate();
  }
})();
