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

turndown.addRule("timeSlot", {
  filter: (node) => node.classList && node.classList.contains("time-slot"),
  replacement: (_content, node) => {
    const time = (node.querySelector(".time") || {}).textContent || "";
    const description = (node.querySelector(".description") || {}).textContent || "";
    return `* **${time.trim()}** — ${description.trim()}\n`;
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
  document.querySelectorAll(".schedule-toggle").forEach((element) => {
    const wrapper = element.parentElement;
    if (wrapper && wrapper.children.length === 1) {
      wrapper.remove();
    } else {
      element.remove();
    }
  });
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
  window.applyEvent({ revealMonitorSchedule: true });

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
