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

  function parseClockMinutes(text) {
    if (!text) {
      return null;
    }

    var start = String(text).split(/[–-]/)[0];
    if (/noon/i.test(start) && !/\d/.test(start)) {
      return 12 * 60;
    }

    var match = start.match(/(\d{1,2}):(\d{2})\s*(AM|PM|noon)?/i);
    if (!match) {
      return null;
    }

    var hour = parseInt(match[1], 10);
    var minute = parseInt(match[2], 10);
    var meridiem = (match[3] || "").toLowerCase();
    if (!meridiem) {
      var laterMeridiem = String(text).match(/\b(AM|PM)\b/i);
      if (laterMeridiem) {
        meridiem = laterMeridiem[1].toLowerCase();
      }
    }

    if (meridiem === "noon") {
      hour = 12;
      minute = 0;
    } else if (meridiem === "pm" && hour < 12) {
      hour += 12;
    } else if (meridiem === "am" && hour === 12) {
      hour = 0;
    } else if (!meridiem && /noon/i.test(text)) {
      hour = 12;
    }

    return hour * 60 + minute;
  }

  function floorToHalfHour(minutes) {
    return Math.floor(minutes / 30) * 30;
  }

  function formatHalfHour(minutes) {
    var hour24 = Math.floor(minutes / 60);
    var minute = minutes % 60;
    var meridiem = hour24 >= 12 ? "PM" : "AM";
    var hour12 = hour24 % 12;
    if (hour12 === 0) {
      hour12 = 12;
    }
    return hour12 + ":" + (minute < 10 ? "0" : "") + minute + " " + meridiem;
  }

  function itemSlotText(item, slotMinutes) {
    var exactMinutes = parseClockMinutes(item.time);
    var label = item.label || "";
    if (exactMinutes != null && exactMinutes !== slotMinutes) {
      return (item.time || "") + " — " + label;
    }
    return label;
  }

  function renderSchedule() {
    var container = document.getElementById("event-schedule");
    var times = window.EVENT && window.EVENT.times;
    if (!container || !times) {
      return;
    }

    var columns = ["rack", "locker", "monitors", "setup"];
    var bySlot = {};
    var extraSlots = [];

    Object.keys(times).forEach(function (key) {
      var item = times[key];
      var minutes = parseClockMinutes(item && item.time);
      if (minutes == null) {
        return;
      }

      var slot = floorToHalfHour(minutes);
      if (!bySlot[slot]) {
        bySlot[slot] = { rack: [], locker: [], monitors: [], setup: [], span: [] };
      }

      if (item.span) {
        bySlot[slot].span.push(item);
      } else {
        var column = columns.indexOf(item.column) === -1 ? "rack" : item.column;
        bySlot[slot][column].push(item);
      }

      if (slot < 18 * 60 || slot > 23 * 60) {
        extraSlots.push(slot);
      }
    });

    var slots = [];
    extraSlots.sort(function (a, b) { return a - b; }).forEach(function (slot) {
      if (slots.indexOf(slot) === -1) {
        slots.push(slot);
      }
    });
    for (var evening = 18 * 60; evening <= 23 * 60; evening += 30) {
      slots.push(evening);
    }

    var table = document.createElement("table");
    table.className = "schedule-table";

    var thead = document.createElement("thead");
    var headerRow = document.createElement("tr");
    ["Time", "Rack", "Locker", "Monitors", "Setup/Teardown"].forEach(function (heading) {
      var th = document.createElement("th");
      th.textContent = heading;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    function fillCell(cell, items, slot) {
      items.forEach(function (item) {
        var line = document.createElement("div");
        line.className = "schedule-item";
        line.textContent = itemSlotText(item, slot);
        cell.appendChild(line);
      });
    }

    var tbody = document.createElement("tbody");
    slots.forEach(function (slot) {
      var grouped = bySlot[slot] || { rack: [], locker: [], monitors: [], setup: [], span: [] };
      var hasColumns = columns.some(function (column) {
        return grouped[column].length;
      });
      var hasSpan = grouped.span.length;

      var row = document.createElement("tr");
      var timeCell = document.createElement("th");
      timeCell.scope = "row";
      timeCell.textContent = formatHalfHour(slot);
      if (hasColumns && hasSpan) {
        timeCell.rowSpan = 2;
      }
      row.appendChild(timeCell);

      if (hasSpan && !hasColumns) {
        var spanOnly = document.createElement("td");
        spanOnly.colSpan = columns.length;
        spanOnly.className = "schedule-span";
        fillCell(spanOnly, grouped.span, slot);
        row.appendChild(spanOnly);
      } else {
        columns.forEach(function (column) {
          var cell = document.createElement("td");
          fillCell(cell, grouped[column], slot);
          row.appendChild(cell);
        });
      }

      tbody.appendChild(row);

      if (hasColumns && hasSpan) {
        var spanRow = document.createElement("tr");
        var spanCell = document.createElement("td");
        spanCell.colSpan = columns.length;
        spanCell.className = "schedule-span";
        fillCell(spanCell, grouped.span, slot);
        spanRow.appendChild(spanCell);
        tbody.appendChild(spanRow);
      }
    });
    table.appendChild(tbody);

    container.innerHTML = "";
    container.appendChild(table);
  }

  function applyEvent() {
    fillBindings(document);
    renderSchedule();
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
