const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const TurndownService = require("turndown");

const root = path.join(__dirname, "..");
const outputDir = path.join(root, "markdown");
const siteUrl = "https://meet-rack.com/";

const pages = [
  "index.html",
  "personal-responsibility.html",
  "meet-rack.html",
  "meet-locker.html",
  "groping.html",
  "speed-meeting.html",
  "aftercare.html",
  "call-for-monitors.html",
  "monitor-guide.html"
];

const eventJs = fs.readFileSync(path.join(root, "event.js"), "utf8");
const applyJs = fs.readFileSync(path.join(root, "apply-event.js"), "utf8");

const turndown = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "*"
});

turndown.addRule("scheduleTable", {
  filter: "table",
  replacement: (_content, node) => {
    const rows = Array.from(node.querySelectorAll("tr")).map((row) => {
      const cells = [];
      row.querySelectorAll("th, td").forEach((cell) => {
        const items = Array.from(cell.querySelectorAll(".schedule-item"))
          .map((item) => item.textContent.replace(/\s+/g, " ").trim())
          .filter(Boolean);
        const text = (items.length ? items.join("; ") : cell.textContent.replace(/\s+/g, " ").trim())
          .replace(/\|/g, "\\|");
        const span = parseInt(cell.getAttribute("colspan") || "1", 10);
        for (let i = 0; i < span; i += 1) {
          cells.push(text);
        }
      });
      return cells;
    });

    if (!rows.length) {
      return "";
    }

    const header = rows[0];
    const divider = header.map(() => "---");
    const body = rows.slice(1).map((row) => {
      const padded = row.slice();
      while (padded.length < header.length) {
        padded.unshift("");
      }
      return padded;
    });
    const lines = [
      `| ${header.join(" | ")} |`,
      `| ${divider.join(" | ")} |`,
      ...body.map((row) => `| ${row.join(" | ")} |`)
    ];
    return `\n${lines.join("\n")}\n\n`;
  }
});

function rewriteLocalLinks(document) {
  document.querySelectorAll("a[href]").forEach((anchor) => {
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) {
      return;
    }

    anchor.setAttribute("href", new URL(href, siteUrl).href);
  });
}

function collectContent(window) {
  const document = window.document;
  document.querySelectorAll("nav, script, .banner").forEach((element) => {
    element.remove();
  });
  document.querySelectorAll("[hidden], [data-event-hide-empty]").forEach((element) => {
    const path = element.getAttribute("data-event-hide-empty");
    const value = path && window.getEventValue ? window.getEventValue(path) : undefined;
    if (element.hidden || element.hasAttribute("hidden") || (path && !value)) {
      element.remove();
    }
  });

  rewriteLocalLinks(document);

  const parts = [];
  const header = document.querySelector("header");
  const main = document.querySelector("main");

  if (header && (!main || !main.contains(header))) {
    parts.push(header.innerHTML);
  }
  if (main) {
    parts.push(main.innerHTML);
  } else {
    const container = document.querySelector(".container") || document.body;
    parts.push(container.innerHTML);
  }

  return parts.join("\n");
}

function generatePage(page) {
  const html = fs.readFileSync(path.join(root, page), "utf8");
  const dom = new JSDOM(html, {
    url: new URL(page, siteUrl).href,
    runScripts: "outside-only"
  });

  const { window } = dom;
  window.GENERATE_MARKDOWN = true;
  window.eval(eventJs);
  window.eval(applyJs);
  window.applyEvent();

  const content = collectContent(window);
  const markdown = [
    `<!-- Generated from ${page}. Do not edit. Run npm run generate-markdown -->`,
    "",
    turndown.turndown(content).trim(),
    ""
  ].join("\n");

  const outputName = page.replace(/\.html$/, ".md");
  fs.writeFileSync(path.join(outputDir, outputName), markdown);
  console.log(`Wrote markdown/${outputName}`);
}

fs.mkdirSync(outputDir, { recursive: true });
pages.forEach(generatePage);
console.log("Markdown refresh complete.");
