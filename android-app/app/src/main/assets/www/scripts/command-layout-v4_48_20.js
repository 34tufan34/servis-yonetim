(function () {
  "use strict";

  if (window.__SYS_V44820_COMMAND_LAYOUT__) return;
  window.__SYS_V44820_COMMAND_LAYOUT__ = true;

  const STYLE_ID = "sys-v44820-command-layout";
  let resizeFrame = 0;

  function installStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      html, body {
        height: 100% !important;
        overflow: hidden !important;
      }

      .app,
      .main {
        height: var(--sys-app-height, 100vh) !important;
        min-height: 0 !important;
        max-height: var(--sys-app-height, 100vh) !important;
        overflow: hidden !important;
      }

      .content-scroll {
        flex: 1 1 auto !important;
        min-height: 0 !important;
        overflow: hidden !important;
      }

      #screen-command {
        height: var(--sys-command-height, 100%) !important;
        min-height: 0 !important;
        max-height: var(--sys-command-height, 100%) !important;
        overflow: hidden !important;
        margin: 0 !important;
      }

      #screen-command.active {
        display: block !important;
      }

      #screen-command .command-dashboard {
        display: grid !important;
        grid-template-columns: minmax(0, 1.55fr) minmax(340px, .98fr) !important;
        gap: 14px !important;
        align-items: stretch !important;
        height: 100% !important;
        min-height: 0 !important;
        max-height: 100% !important;
        overflow: hidden !important;
        margin: 0 !important;
      }

      #screen-command .command-left,
      #screen-command .command-right {
        min-width: 0 !important;
        min-height: 0 !important;
        height: 100% !important;
        max-height: 100% !important;
        overflow: hidden !important;
        align-self: stretch !important;
      }

      #screen-command .command-left {
        display: grid !important;
        grid-template-rows: minmax(112px, 138px) minmax(0, 1fr) !important;
        gap: 14px !important;
      }

      #screen-command .command-right {
        display: grid !important;
        grid-template-rows:
          minmax(0, .86fr)
          minmax(0, .74fr)
          minmax(0, 1.30fr) !important;
        gap: 14px !important;
      }

      #screen-command .service-grid {
        display: grid !important;
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 14px !important;
        min-height: 0 !important;
        height: 100% !important;
        overflow: hidden !important;
      }

      #screen-command .command-card,
      #screen-command .service-command-card,
      #screen-command .right-card-inner {
        min-height: 0 !important;
        max-height: 100% !important;
      }

      #screen-command .command-card {
        overflow: hidden !important;
      }

      #screen-command .service-command-card {
        height: 100% !important;
        overflow: hidden !important;
      }

      #screen-command .right-card-inner {
        height: 100% !important;
        overflow: hidden !important;
        display: flex !important;
        flex-direction: column !important;
      }

      #screen-command .station-grid {
        min-height: 0 !important;
        flex: 1 1 auto !important;
        align-items: stretch !important;
      }

      @media (orientation: landscape) and (min-width: 900px) {
        .content-scroll {
          overflow: hidden !important;
        }

        #screen-command .command-dashboard {
          grid-template-columns: minmax(0, 1.58fr) minmax(330px, .92fr) !important;
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
          overflow: visible !important;
          grid-template-columns: 1fr !important;
        }

        #screen-command .command-left,
        #screen-command .command-right {
          height: auto !important;
          max-height: none !important;
          overflow: visible !important;
        }

        #screen-command .command-left,
        #screen-command .command-right {
          grid-template-rows: none !important;
          grid-auto-rows: auto !important;
        }

        #screen-command .service-grid {
          height: auto !important;
          grid-template-columns: 1fr !important;
          overflow: visible !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function visibleViewportHeight() {
    const vv = window.visualViewport;
    return Math.max(320, Math.round(vv && vv.height ? vv.height : window.innerHeight));
  }

  function calculateAndApply() {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      installStyle();

      const viewportHeight = visibleViewportHeight();
      document.documentElement.style.setProperty("--sys-app-height", `${viewportHeight}px`);

      const content = document.querySelector(".content-scroll");
      const screen = document.getElementById("screen-command");
      if (!content || !screen) return;

      const style = getComputedStyle(content);
      const verticalPadding =
        (parseFloat(style.paddingTop) || 0) +
        (parseFloat(style.paddingBottom) || 0);

      const commandHeight = Math.max(
        360,
        Math.floor(content.clientHeight - verticalPadding)
      );

      document.documentElement.style.setProperty("--sys-command-height", `${commandHeight}px`);

      const dashboard = screen.querySelector(".command-dashboard");
      const left = screen.querySelector(".command-left");
      const right = screen.querySelector(".command-right");

      if (dashboard) dashboard.style.height = `${commandHeight}px`;
      if (left) left.style.height = `${commandHeight}px`;
      if (right) right.style.height = `${commandHeight}px`;

      screen.dataset.sysLayoutVersion = "4.48.20";
    });
  }

  function watchScreenChanges() {
    const screen = document.getElementById("screen-command");
    if (!screen) return;

    new MutationObserver(() => {
      if (screen.classList.contains("active")) calculateAndApply();
    }).observe(screen, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["class", "style"]
    });
  }

  function start() {
    installStyle();
    calculateAndApply();
    watchScreenChanges();

    window.addEventListener("resize", calculateAndApply, { passive: true });
    window.addEventListener("orientationchange", () => {
      setTimeout(calculateAndApply, 80);
      setTimeout(calculateAndApply, 300);
      setTimeout(calculateAndApply, 700);
    }, { passive: true });

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", calculateAndApply, { passive: true });
      window.visualViewport.addEventListener("scroll", calculateAndApply, { passive: true });
    }

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) setTimeout(calculateAndApply, 80);
    });

    setTimeout(calculateAndApply, 0);
    setTimeout(calculateAndApply, 250);
    setTimeout(calculateAndApply, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
