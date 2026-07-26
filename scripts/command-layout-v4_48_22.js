(function () {
  "use strict";

  if (window.__SYS_V44822_COMMAND_LAYOUT__) return;
  window.__SYS_V44822_COMMAND_LAYOUT__ = true;

  const STYLE_ID = "sys-v44822-command-layout";

  function installStyle() {
    document.getElementById("sys-v44819-tablet-command-layout")?.remove();
    document.getElementById("sys-v44820-command-layout")?.remove();
    document.getElementById("sys-v44821-command-layout")?.remove();

    let style = document.getElementById(STYLE_ID);
    if (style) return;

    style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      :root {
        --sys-real-viewport: 100vh;
      }

      @supports (height: 100dvh) {
        :root {
          --sys-real-viewport: 100dvh;
        }
      }

      html,
      body,
      .app,
      .main,
      .sidebar {
        height: var(--sys-real-viewport) !important;
        min-height: var(--sys-real-viewport) !important;
        max-height: var(--sys-real-viewport) !important;
      }

      html,
      body {
        width: 100% !important;
        margin: 0 !important;
        overflow: hidden !important;
      }

      .main {
        display: flex !important;
        flex-direction: column !important;
        overflow: hidden !important;
      }

      .topbar {
        flex: 0 0 auto !important;
      }

      .content-scroll {
        flex: 1 1 0 !important;
        height: auto !important;
        min-height: 0 !important;
        overflow: hidden !important;
        padding-bottom: 12px !important;
      }

      #screen-command {
        display: none;
        width: 100% !important;
        height: 100% !important;
        min-height: 0 !important;
        max-height: 100% !important;
        margin: 0 !important;
        overflow: hidden !important;
      }

      #screen-command.active {
        display: block !important;
      }

      #screen-command .command-dashboard {
        width: 100% !important;
        height: 100% !important;
        min-height: 0 !important;
        max-height: 100% !important;
        margin: 0 !important;
        display: grid !important;
        grid-template-columns: minmax(0, 1.55fr) minmax(360px, .98fr) !important;
        grid-template-rows: minmax(0, 1fr) !important;
        gap: 14px !important;
        align-items: stretch !important;
        align-content: stretch !important;
        overflow: hidden !important;
      }

      #screen-command .command-main-column,
      #screen-command .command-side-column {
        width: 100% !important;
        height: 100% !important;
        min-width: 0 !important;
        min-height: 0 !important;
        max-height: 100% !important;
        align-self: stretch !important;
        align-content: stretch !important;
        overflow: hidden !important;
      }

      #screen-command .command-main-column {
        display: grid !important;
        grid-template-rows: 138px minmax(0, 1fr) !important;
        gap: 14px !important;
      }

      #screen-command .command-service-grid {
        width: 100% !important;
        height: 100% !important;
        min-height: 0 !important;
        display: grid !important;
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        grid-template-rows: minmax(0, 1fr) !important;
        gap: 14px !important;
        align-items: stretch !important;
        overflow: hidden !important;
      }

      #screen-command .command-service-card {
        height: 100% !important;
        min-height: 0 !important;
        max-height: 100% !important;
        align-self: stretch !important;
        overflow: hidden !important;
      }

      #screen-command .command-side-column {
        display: grid !important;
        grid-template-columns: minmax(0, 1fr) !important;
        grid-template-rows:
          minmax(150px, .88fr)
          minmax(140px, .74fr)
          minmax(220px, 1.38fr) !important;
        gap: 14px !important;
      }

      #screen-command .command-side-column > * {
        width: 100% !important;
        height: 100% !important;
        min-width: 0 !important;
        min-height: 0 !important;
        max-height: 100% !important;
        margin: 0 !important;
        align-self: stretch !important;
        overflow: hidden !important;
      }

      #screen-command .command-ops-card,
      #screen-command .command-fuel-diff-card,
      #screen-command #commandFuelPanel,
      #screen-command #commandFuelPanel.fuel-live-panel {
        height: 100% !important;
        min-height: 0 !important;
        max-height: 100% !important;
      }

      @media (orientation: landscape) and (min-width: 900px) {
        .content-scroll {
          overflow: hidden !important;
        }
      }

      @media (max-width: 899px), (orientation: portrait) {
        .content-scroll {
          overflow: auto !important;
        }

        #screen-command {
          height: auto !important;
          max-height: none !important;
          overflow: visible !important;
        }

        #screen-command .command-dashboard {
          height: auto !important;
          max-height: none !important;
          grid-template-columns: 1fr !important;
          grid-template-rows: none !important;
          overflow: visible !important;
        }

        #screen-command .command-main-column,
        #screen-command .command-side-column,
        #screen-command .command-service-grid,
        #screen-command .command-service-card,
        #screen-command .command-side-column > * {
          height: auto !important;
          max-height: none !important;
          overflow: visible !important;
        }

        #screen-command .command-main-column,
        #screen-command .command-side-column {
          grid-template-rows: none !important;
          grid-auto-rows: auto !important;
        }

        #screen-command .command-service-grid {
          grid-template-columns: 1fr !important;
          grid-template-rows: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function clearOldInlineSizing() {
    document.documentElement.style.removeProperty("--sys-app-height");
    document.documentElement.style.removeProperty("--sys-command-height");
    document.documentElement.style.removeProperty("--sys-visible-height");

    const screen = document.getElementById("screen-command");
    if (!screen) return;

    [
      screen,
      screen.querySelector(".command-dashboard"),
      screen.querySelector(".command-main-column"),
      screen.querySelector(".command-side-column"),
      screen.querySelector(".command-service-grid")
    ].filter(Boolean).forEach((element) => {
      element.style.removeProperty("height");
      element.style.removeProperty("max-height");
      element.style.removeProperty("min-height");
    });

    screen.dataset.sysLayoutVersion = "4.48.22";
  }

  function apply() {
    installStyle();
    clearOldInlineSizing();
  }

  function start() {
    apply();

    window.addEventListener("resize", apply, { passive: true });
    window.addEventListener("orientationchange", () => {
      setTimeout(apply, 50);
      setTimeout(apply, 250);
      setTimeout(apply, 700);
    }, { passive: true });

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) setTimeout(apply, 50);
    });

    const bodyObserver = new MutationObserver(() => {
      const screen = document.getElementById("screen-command");
      if (screen?.classList.contains("active")) apply();
    });

    bodyObserver.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["class"]
    });

    setTimeout(apply, 0);
    setTimeout(apply, 200);
    setTimeout(apply, 800);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
