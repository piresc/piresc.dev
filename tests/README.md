# Browser test suite

`portfolio.browser.js` checks user-visible behavior of the production build: video loading and pausing (including reduced motion and offscreen deferral), focus visibility of the sticky nav, hero font delivery via CDP, 44px touch targets on mobile links, Launchpad external-link safety and visible keyboard focus, a hidden Launchpad drawer in a centered page footer that opens by wheel pull, click, Enter, or press-and-hold and closes with Escape (including reduced motion), and no overflow with enlarged root text at 320/390/768px.

It is a single `async (page) => {...}` expression that drives a real browser against the built site:

```bash
npm run build
npm run preview -- --host 0.0.0.0 --port 5173 --strictPort
# Browser URL: http://prox-debian.tail9c1cfb.ts.net:5173
```

Then run it under a Playwright runner that supplies the `page` handle. From a Claude Code session with the Playwright MCP server connected, that is `browser_run_code_unsafe` with `filename: "tests/portfolio.browser.js"`; it returns `{ passed, failed, checks }`.

Plain `node tests/portfolio.browser.js` is a deliberate no-op: the file is one uncalled function expression because it needs Playwright's `page`. A `npm run test:browser` wrapper would require Playwright as a devDependency plus a Chromium install; the CDP-based checks (`CSS.getPlatformFontsForNode`) already run against the MCP server's browser.
