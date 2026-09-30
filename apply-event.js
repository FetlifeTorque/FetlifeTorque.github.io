(function () {
  function getEventValue(path) {
    if (!path || !window.EVENT) {
      return undefined;
    }

    return path.split(".").reduce(function (object, key) {
      return object == null ? undefined : object[key];
    }, window.EVENT);
  }

  function interpolate(template) {
    return String(template).replace(/\{([^}]+)\}/g, function (_, path) {
      var value = getEventValue(path);
      return value == null ? "" : value;
    });
  }

  function fillBindings(root) {
    root.querySelectorAll("[data-event]").forEach(function (element) {
      var value = getEventValue(element.getAttribute("data-event"));
      if (value == null) {
        return;
      }
      element.textContent = value;
    });

    root.querySelectorAll("[data-event-href]").forEach(function (element) {
      var value = getEventValue(element.getAttribute("data-event-href"));
      if (value) {
        element.setAttribute("href", value);
      }
    });

    root.querySelectorAll("[data-event-title]").forEach(function (element) {
      var title = interpolate(element.getAttribute("data-event-title"));
      element.textContent = title;
      if (element.tagName === "TITLE") {
        document.title = title;
      }
    });

    root.querySelectorAll("[data-event-hide-empty]").forEach(function (element) {
      var value = getEventValue(element.getAttribute("data-event-hide-empty"));
      element.hidden = !value;
    });
  }

  function applyEvent() {
    fillBindings(document);
  }

  window.applyEvent = applyEvent;
  window.getEventValue = getEventValue;

  function start() {
    applyEvent();
  }

  document.addEventListener("DOMContentLoaded", start);
  if (document.readyState !== "loading") {
    start();
  }
})();
