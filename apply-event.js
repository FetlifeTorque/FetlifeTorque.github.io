(function () {
  function getEventValue(path) {
    if (!path || !window.EVENT) {
      return undefined;
    }

    var value = path.split(".").reduce(function (object, key) {
      return object == null ? undefined : object[key];
    }, window.EVENT);

    if (value && typeof value === "object" && !Array.isArray(value) && "time" in value) {
      return value.time;
    }

    return value;
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

  function renderSchedule(revealMonitorSchedule) {
    var container = document.getElementById("event-schedule");
    var times = window.EVENT && window.EVENT.times;
    if (!container || !times) {
      return;
    }

    var existingToggle = container.querySelector(".schedule-toggle");
    var toggleWrapper = existingToggle && existingToggle.parentElement;

    container.querySelectorAll(".time-slot").forEach(function (slot) {
      slot.remove();
    });

    Object.keys(times).forEach(function (key) {
      var item = times[key];
      if (!item || item.onSchedule === false) {
        return;
      }

      var slot = document.createElement("div");
      var classes = ["time-slot"];
      if (item.kind) {
        classes.push(item.kind);
      }
      if (item.monitor) {
        classes.push("monitor-schedule");
      }
      slot.className = classes.join(" ");
      if (item.monitor && !revealMonitorSchedule) {
        slot.hidden = true;
      }

      var time = document.createElement("div");
      time.className = "time";
      time.textContent = item.time || "";

      var description = document.createElement("div");
      description.className = "description";
      description.textContent = item.label || "";

      slot.appendChild(time);
      slot.appendChild(description);

      if (toggleWrapper) {
        container.insertBefore(slot, toggleWrapper);
      } else {
        container.appendChild(slot);
      }
    });
  }

  function bindScheduleToggle() {
    var toggle = document.querySelector(".schedule-toggle");
    if (!toggle || toggle.dataset.bound === "true") {
      return;
    }

    toggle.dataset.bound = "true";
    toggle.addEventListener("click", function () {
      var isExpanded = toggle.getAttribute("aria-expanded") === "true";
      var reveal = !isExpanded;

      document.querySelectorAll(".monitor-schedule").forEach(function (item) {
        item.hidden = !reveal;
      });

      toggle.setAttribute("aria-expanded", String(reveal));
      toggle.textContent = reveal
        ? "Hide Monitoring Schedule"
        : "Show Monitoring Schedule";
    });
  }

  function applyEvent(options) {
    options = options || {};
    fillBindings(document);
    renderSchedule(Boolean(options.revealMonitorSchedule));
    if (!options.skipToggle) {
      bindScheduleToggle();
    }
  }

  window.applyEvent = applyEvent;
  window.getEventValue = getEventValue;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      applyEvent({
        revealMonitorSchedule: Boolean(window.GENERATE_MARKDOWN)
      });
    });
  } else {
    applyEvent({
      revealMonitorSchedule: Boolean(window.GENERATE_MARKDOWN)
    });
  }
})();
