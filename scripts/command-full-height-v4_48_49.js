(function () {
  "use strict";

  if (window.__SYS_COMMAND_FULL_HEIGHT_V44849__) return;
  window.__SYS_COMMAND_FULL_HEIGHT_V44849__ = true;

  const style = document.createElement("style");
  style.id = "sys-command-full-height-v44849";
  style.textContent = `
    @media (min-width: 1051px) {
      body.modern-command-active .command-preview-screen,
      body.modern-command-active .command-preview-shell {
        height: 100% !important;
        min-height: 0 !important;
      }

      body.modern-command-active .command-preview-body {
        top: var(--sys-command-card-top, 142px) !important;
        bottom: 18px !important;
        min-height: 0 !important;
        align-items: stretch !important;
      }

      body.modern-command-active .command-preview-services {
        height: 100% !important;
        min-height: 0 !important;
        align-self: stretch !important;
        align-items: stretch !important;
        grid-auto-rows: minmax(0, 1fr) !important;
      }

      body.modern-command-active .command-preview-service {
        box-sizing: border-box !important;
        height: 100% !important;
        min-height: 0 !important;
        max-height: none !important;
        align-self: stretch !important;
        overflow: hidden !important;
      }

      body.modern-command-active .command-preview-passenger {
        flex: 1 1 auto !important;
        min-height: 70px !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
      }

      body.modern-command-active .command-preview-actions {
        margin-top: auto !important;
      }

      body.modern-command-active .command-preview-rail {
        height: 100% !important;
        max-height: 100% !important;
        min-height: 0 !important;
        align-self: stretch !important;
        overflow-x: hidden !important;
        overflow-y: auto !important;
      }

      body.modern-command-active .command-preview-health-radar {
        flex: 1 0 190px !important;
        min-height: 190px !important;
        display: flex !important;
        flex-direction: column !important;
      }

      body.modern-command-active .command-preview-health-radar .preview-health-list {
        flex: 1 1 auto !important;
        align-content: start !important;
      }

      body.modern-command-active .command-preview-health-radar .preview-health-open {
        margin-top: auto !important;
      }
    }
  `;
  document.head.appendChild(style);

  let observedShell = null;
  let resizeObserver = null;
  let frame = 0;

  function fitCards() {
    frame = 0;
    if (!window.matchMedia("(min-width: 1051px)").matches) return;

    const shell = document.querySelector(".command-preview-shell");
    const live = shell?.querySelector(".command-preview-live");
    if (!shell || !live) return;

    const shellBox = shell.getBoundingClientRect();
    const liveBox = live.getBoundingClientRect();
    const preferredTop = Math.round(liveBox.bottom - shellBox.top + 12);
    const maximumTop = Math.max(108, Math.floor(shellBox.height - 378));
    const cardTop = Math.max(108, Math.min(preferredTop, maximumTop));
    shell.style.setProperty("--sys-command-card-top", `${cardTop}px`);

    if (window.ResizeObserver && observedShell !== shell) {
      resizeObserver?.disconnect();
      resizeObserver = new ResizeObserver(scheduleFit);
      resizeObserver.observe(shell);
      resizeObserver.observe(live);
      observedShell = shell;
    }
  }

  function scheduleFit() {
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(fitCards);
  }

  window.addEventListener("resize", scheduleFit, { passive: true });
  window.addEventListener("orientationchange", scheduleFit, { passive: true });

  const observer = new MutationObserver(scheduleFit);
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
  scheduleFit();
})();
