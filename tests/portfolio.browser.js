// Run this file through Playwright's browser_run_code_unsafe against the production preview.
(async (page) => {
  const checks = [];
  const pages = [];
  const url = 'http://127.0.0.1:5173';
  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
  };
  const check = async (name, run) => {
    try {
      const details = await run();
      checks.push({ name, passed: true, details });
    } catch (error) {
      checks.push({ name, passed: false, error: error.message });
    }
  };
  const open = async (viewport, reducedMotion = 'no-preference') => {
    const tab = await page.context().newPage();
    pages.push(tab);
    await tab.setViewportSize(viewport);
    await tab.emulateMedia({ reducedMotion });
    return tab;
  };
  const settle = async (tab) => {
    await tab.evaluate(() => document.fonts.ready);
    await tab.waitForTimeout(900);
  };
  const openLaunchpad = async (tab) => {
    await tab.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const chevron = tab.locator('footer button[aria-label="Launchpad"]');
    if (await chevron.getAttribute('aria-expanded') === 'false') {
      await chevron.focus();
      await tab.keyboard.press('Enter');
    }
    await tab.waitForTimeout(700);
  };

  try {
    const desktop = await open({ width: 1440, height: 900 });
    const mediaRequests = [];
    desktop.on('request', (request) => {
      if (request.url().includes('/videos/')) mediaRequests.push(request.url());
    });
    await desktop.goto(url, { waitUntil: 'domcontentloaded' });
    await settle(desktop);

    await check('Offscreen project video waits until approached', async () => {
      assert(!mediaRequests.some((value) => value.includes('projects.mp4')), 'Project video requested before its card was approached');
      return [...mediaRequests];
    });

    await check('Changing reduced-motion preference stops media before approaching projects', async () => {
      try {
        await desktop.emulateMedia({ reducedMotion: 'reduce' });
        await desktop.waitForTimeout(200);
        assert(await desktop.locator('video').count() === 0, 'Enabling reduced motion leaves a video mounted');
        await desktop.locator('#projects').scrollIntoViewIfNeeded();
        await desktop.waitForTimeout(300);
        assert(!mediaRequests.some((value) => value.includes('projects.mp4')), 'Project video loaded after reduced motion was enabled');
      } finally {
        await desktop.locator('#home').scrollIntoViewIfNeeded();
        await desktop.emulateMedia({ reducedMotion: 'no-preference' });
        await desktop.waitForTimeout(400);
      }
    });

    await check('Tab never focuses hidden sticky navigation', async () => {
      const focusOrder = [];
      for (let index = 0; index < 5; index++) {
        await desktop.keyboard.press('Tab');
        const focus = await desktop.evaluate(() => {
          const active = document.activeElement;
          let visible = true;
          for (let element = active; element; element = element.parentElement) {
            const style = getComputedStyle(element);
            if (style.visibility === 'hidden' || style.display === 'none' || Number(style.opacity) === 0) visible = false;
          }
          return { label: active.textContent.trim(), visible };
        });
        focusOrder.push(focus);
        assert(focus.visible, `Focused invisible control: ${focus.label}`);
      }
      return focusOrder;
    });

    await check('Hero video pauses offscreen and resumes on return', async () => {
      await desktop.waitForFunction(() => !document.querySelector('#home video').paused);
      await desktop.locator('#projects').scrollIntoViewIfNeeded();
      await desktop.waitForFunction(() => document.querySelector('#home video').paused);
      await desktop.locator('#home').scrollIntoViewIfNeeded();
      await desktop.waitForFunction(() => !document.querySelector('#home video').paused);
    });

    await check('Project video plays when approached without playback buttons', async () => {
      await desktop.locator('#projects').scrollIntoViewIfNeeded();
      await desktop.waitForFunction(() => {
        const video = document.querySelector('#projects video');
        return video && !video.paused;
      });
      assert(await desktop.getByRole('button', { name: /(?:Pause|Play).*video/ }).count() === 0, 'Playback buttons remain');
    });

    await check('Sticky navigation works after scrolling and hides on return', async () => {
      const sticky = desktop.getByRole('navigation', { name: 'Main navigation', exact: true });
      await sticky.getByRole('link', { name: 'piresc', exact: true }).click();
      await desktop.waitForTimeout(400);
      assert(await sticky.isHidden(), 'Sticky navigation remains interactive at the hero');
    });

    await check('Hero actually renders Zodiak and section headings use its family', async () => {
      const session = await desktop.context().newCDPSession(desktop);
      try {
        await session.send('DOM.enable');
        await session.send('CSS.enable');
        const document = await session.send('DOM.getDocument');
        const node = await session.send('DOM.querySelector', { nodeId: document.root.nodeId, selector: '#home h1' });
        const result = await session.send('CSS.getPlatformFontsForNode', { nodeId: node.nodeId });
        // Fontshare's current font files expose "false" as their internal family name.
        const zodiakLoaded = await desktop.evaluate(() => Array.from(document.fonts).some((font) => font.family === 'Zodiak' && font.status === 'loaded'));
        // The h1 also holds an sr-only ", Backend Engineer" span, so the painted
        // glyph count is the wordmark plus that suffix; only require the wordmark.
        assert(zodiakLoaded && result.fonts.some((font) => font.isCustomFont && font.glyphCount >= 7), `Hero rendered: ${result.fonts.map((font) => font.familyName).join(', ')}`);
        const headings = await desktop.locator('.section-title, .section-subtitle').evaluateAll((elements) => elements.map((element) => getComputedStyle(element).fontFamily));
        assert(headings.every((family) => family.includes('Zodiak')), 'Section heading inherits body font');
        return result.fonts;
      } finally {
        await session.detach();
      }
    });

    await check('Desktop Launchpad names remain readable without word fragments', async () => {
      await openLaunchpad(desktop);
      const names = await desktop.locator('nav[aria-label="Launchpad"] ul a span').evaluateAll((elements) => elements.map((element) => {
        const style = getComputedStyle(element);
        return { label: element.textContent.trim(), height: element.getBoundingClientRect().height, lineHeight: parseFloat(style.lineHeight) };
      }));
      assert(names.length === 5 && names.every((name) => name.height <= name.lineHeight + 1), `Desktop Launchpad names break into fragments: ${JSON.stringify(names)}`);
      return names;
    });

    const mobile = await open({ width: 390, height: 844 });
    await mobile.goto(url, { waitUntil: 'domcontentloaded' });
    await settle(mobile);
    await check('Secondary mobile links retain 44px hit areas', async () => {
      const measure = (elements) => elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return { label: element.textContent.trim(), width: rect.width, height: rect.height };
      });
      const targets = [];
      await mobile.locator('#about a[href="#contact"]').scrollIntoViewIfNeeded();
      await mobile.waitForTimeout(1000);
      targets.push(...await mobile.locator('#about a[href="#contact"]').evaluateAll(measure));
      await mobile.locator('#contact').scrollIntoViewIfNeeded();
      await mobile.waitForTimeout(1000);
      targets.push(...await mobile.locator('#contact a[target="_blank"]').evaluateAll(measure));
      await openLaunchpad(mobile);
      targets.push(...await mobile.locator('nav[aria-label="Launchpad"] ul a').evaluateAll(measure));
      targets.push(...await mobile.locator('footer button[aria-label="Launchpad"]').evaluateAll(measure));
      assert(targets.every((target) => target.width >= 44 && target.height >= 44), `Undersized controls: ${JSON.stringify(targets.filter((target) => target.width < 44 || target.height < 44))}`);
      return targets;
    });
    await check('Launchpad index links live sub-sites as external targets', async () => {
      await openLaunchpad(mobile);
      const links = await mobile.locator('nav[aria-label="Launchpad"] ul a').evaluateAll((elements) => elements.map((element) => ({
        label: element.textContent.trim(),
        href: element.getAttribute('href'),
        target: element.getAttribute('target'),
        rel: element.getAttribute('rel'),
      })));
      assert(links.length === 5, `Expected 5 launchpad links, found ${links.length}`);
      assert(links.every((link) => /^https:\/\/[a-z]+\.piresc\.dev$/.test(link.href)), `Unexpected href: ${JSON.stringify(links)}`);
      assert(links.every((link) => link.target === '_blank' && link.rel === 'noopener noreferrer'), `Unsafe external attrs: ${JSON.stringify(links)}`);
      return links;
    });
    await check('Launchpad lives in a centered page footer, not in Contact', async () => {
      const contact = desktop.locator('#contact');
      const footer = desktop.getByRole('contentinfo');
      assert(await contact.locator('nav[aria-label="Launchpad"]').count() === 0, 'Launchpad list still sits in Contact');
      assert(await contact.locator('footer').count() === 0, 'Page footer is nested in Contact');
      assert(await footer.count() === 1, 'Page has no single top-level footer landmark');
      assert(await footer.locator('nav[aria-label="Launchpad"] ul').count() === 1, 'Footer does not contain the Launchpad nav');
      await desktop.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await desktop.waitForTimeout(300);
      const geometry = await desktop.evaluate(() => {
        const footer = document.querySelector('footer');
        const inner = footer.firstElementChild.getBoundingClientRect();
        const text = Array.from(footer.querySelectorAll('p')).find((element) => element.textContent.includes('\u00a9'));
        const range = document.createRange();
        range.selectNodeContents(text);
        const textRect = range.getBoundingClientRect();
        const button = footer.querySelector('button[aria-label="Launchpad"]').getBoundingClientRect();
        const hairline = footer.querySelector('[aria-hidden="true"]');
        const line = hairline.getBoundingClientRect();
        return { center: inner.left + inner.width / 2, textCenter: textRect.left + textRect.width / 2, buttonCenter: button.left + button.width / 2,
          hairlineHeight: line.height, hairlineHidden: hairline.getAttribute('aria-hidden') };
      });
      assert(Math.abs(geometry.textCenter - geometry.center) <= 2, `Copyright is not centered: ${JSON.stringify(geometry)}`);
      assert(Math.abs(geometry.buttonCenter - geometry.center) <= 2, `Chevron is not centered: ${JSON.stringify(geometry)}`);
      assert(Math.abs(geometry.hairlineHeight - 1) < 0.1 && geometry.hairlineHidden === 'true', `Hairline is missing or exposed: ${JSON.stringify(geometry)}`);
      return geometry;
    });
    await check('Contact is centered like the original', async () => {
      await desktop.locator('#contact').scrollIntoViewIfNeeded();
      await desktop.waitForTimeout(800);
      const geometry = await desktop.evaluate(() => {
        const contact = document.querySelector('#contact');
        const inner = contact.firstElementChild.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(contact.querySelector('h2'));
        const heading = range.getBoundingClientRect();
        const row = contact.querySelector('a[href^="mailto:"]').parentElement;
        const first = row.firstElementChild.getBoundingClientRect();
        const last = row.lastElementChild.getBoundingClientRect();
        return { center: inner.left + inner.width / 2, headingCenter: heading.left + heading.width / 2,
          rowCenter: (first.left + last.right) / 2 };
      });
      assert(Math.abs(geometry.headingCenter - geometry.center) <= 2, `Contact heading is not centered: ${JSON.stringify(geometry)}`);
      assert(Math.abs(geometry.rowCenter - geometry.center) <= 2, `Contact actions are not centered: ${JSON.stringify(geometry)}`);
      return geometry;
    });
    await check('Launchpad index is borderless with usable targets and keyboard focus', async () => {
      await openLaunchpad(mobile);
      const links = mobile.locator('nav[aria-label="Launchpad"] ul a');
      await links.first().scrollIntoViewIfNeeded();
      const entries = await links.evaluateAll((elements) => elements.map((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return { label: element.textContent.trim(), background: style.backgroundColor, border: parseFloat(style.borderTopWidth), width: rect.width, height: rect.height,
          fontSize: parseFloat(getComputedStyle(element.querySelector('span') || element).fontSize) };
      }));
      assert(entries.length === 5, 'Launchpad entries are missing');
      assert(entries.every((entry) => entry.background === 'rgba(0, 0, 0, 0)' && entry.border === 0 && entry.fontSize >= 14 && entry.width >= 44 && entry.height >= 44), `Launchpad index has boxed or undersized links: ${JSON.stringify(entries)}`);
      await links.first().focus();
      await mobile.keyboard.press('Tab');
      const focus = await links.nth(1).evaluate((element) => {
        const style = getComputedStyle(element);
        return { active: document.activeElement === element, visible: element.matches(':focus-visible'), width: parseFloat(style.outlineWidth), style: style.outlineStyle };
      });
      assert(focus.active && focus.visible && focus.width >= 2 && focus.style !== 'none', `Index link has no visible keyboard focus: ${JSON.stringify(focus)}`);
      return entries;
    });
    await check('Enlarged root text fits at 320px, 390px, and 768px without overflow', async () => {
      await mobile.evaluate(() => { document.documentElement.style.fontSize = '32px'; });
      await openLaunchpad(mobile);
      const results = [];
      for (const [width, height] of [[320, 568], [390, 844], [768, 1024]]) {
        await mobile.setViewportSize({ width, height });
        await mobile.locator('#home').scrollIntoViewIfNeeded();
        await mobile.waitForTimeout(300);
        const result = await mobile.evaluate(() => {
        const hero = document.querySelector('#home').getBoundingClientRect();
        const content = Array.from(document.querySelectorAll('#home h1, #home p, #home a[download]')).map((element) => {
          const rect = element.getBoundingClientRect();
          return { label: element.textContent.trim(), top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right };
        });
        return { hero: { top: hero.top, bottom: hero.bottom }, width: document.documentElement.scrollWidth, content };
        });
        const ending = await mobile.locator('nav[aria-label="Launchpad"] ul a, #contact a').evaluateAll((elements) => elements.map((element) => {
          const rect = element.getBoundingClientRect();
          return { label: element.textContent.trim(), left: rect.left, right: rect.right, scrollWidth: element.scrollWidth, width: element.clientWidth };
        }));
        assert(ending.every((item) => item.left >= 0 && item.right <= width && item.scrollWidth <= item.width + 1), `Ending clips enlarged text at ${width}px: ${JSON.stringify(ending)}`);
        assert(result.width <= width, `At ${width}px, page width grew to ${result.width}px`);
        assert(result.content.every((item) => item.top >= result.hero.top && item.bottom <= result.hero.bottom && item.left >= 0 && item.right <= width), `Hero clips enlarged content at ${width}px: ${JSON.stringify(result)}`);
        results.push({ viewport: width, ...result });
      }
      return results;
    });

    const reduced = await open({ width: 390, height: 844 }, 'reduce');
    const reducedRequests = [];
    reduced.on('request', (request) => {
      if (request.url().includes('/videos/')) reducedRequests.push(request.url());
    });
    await reduced.goto(url, { waitUntil: 'domcontentloaded' });
    await settle(reduced);
    await check('Reduced motion suppresses video loading and leaves content visible', async () => {
      assert(await reduced.locator('video').count() === 0, 'Reduced-motion page still contains a video');
      assert(reducedRequests.length === 0, 'Reduced-motion page requested video data');
      assert(await reduced.locator('#home h1').isVisible(), 'Hero title is hidden with reduced motion');
      assert(await reduced.getByRole('button', { name: /(?:Pause|Play).*video/ }).count() === 0, 'Reduced-motion page offers an irrelevant video control');
    });
    const hidden = await open({ width: 1440, height: 900 });
    await hidden.goto(url, { waitUntil: 'domcontentloaded' });
    await settle(hidden);
    await check('Launchpad is hidden until pulled open', async () => {
      const state = () => hidden.evaluate(() => {
        const drawer = document.querySelector('#launchpad-sites');
        const links = Array.from(drawer.querySelectorAll('a')).map((link) => {
          const rect = link.getBoundingClientRect();
          return { height: rect.height, visibility: getComputedStyle(link).visibility };
        });
        return { height: drawer.getBoundingClientRect().height, open: drawer.getAttribute('data-open'), inert: drawer.inert,
          expanded: document.querySelector('footer button[aria-label="Launchpad"]').getAttribute('aria-expanded'), links };
      });
      const initial = await state();
      assert(initial.height <= 1 && initial.open === 'false' && initial.inert === true && initial.expanded === 'false', `Launchpad is not hidden on load: ${JSON.stringify(initial)}`);
      const focusable = await hidden.evaluate(() => {
        const link = document.querySelector('#launchpad-sites a');
        link.focus();
        return document.activeElement === link;
      });
      assert(!focusable, 'Hidden Launchpad link accepted focus');
      await hidden.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await hidden.waitForTimeout(400);
      await hidden.mouse.move(720, 450);
      await hidden.mouse.wheel(0, 300);
      await hidden.waitForTimeout(100);
      assert((await state()).open === 'false', 'A single wheel flick opened Launchpad');
      await hidden.waitForTimeout(1000);
      const fill = await hidden.evaluate(() => getComputedStyle(document.querySelector('footer [aria-hidden="true"] span')).transform);
      assert(fill === 'none' || /^matrix\(0,/.test(fill), `Pull progress did not decay: ${fill}`);
      assert((await state()).open === 'false', 'Launchpad opened after a single flick');
      for (let index = 0; index < 8; index++) {
        await hidden.mouse.wheel(0, 150);
        await hidden.waitForTimeout(40);
      }
      await hidden.waitForTimeout(900);
      const opened = await state();
      assert(opened.open === 'true' && opened.expanded === 'true', `Sustained wheel did not open Launchpad: ${JSON.stringify(opened)}`);
      assert(opened.links.length === 5 && opened.links.every((link) => link.height >= 44 && link.visibility === 'visible'), `Opened links are not visible: ${JSON.stringify(opened.links)}`);
      const bottom = await hidden.evaluate(() => {
        const links = document.querySelectorAll('#launchpad-sites a');
        return { bottom: links[links.length - 1].getBoundingClientRect().bottom, inner: window.innerHeight };
      });
      assert(bottom.bottom <= bottom.inner + 1, `Opened Launchpad is not scrolled fully into view: ${JSON.stringify(bottom)}`);
      return { fill, opened };
    });

    const chevronTab = await open({ width: 1440, height: 900 });
    await chevronTab.goto(url, { waitUntil: 'domcontentloaded' });
    await settle(chevronTab);
    await check('Launchpad chevron opens by click, Enter, and hold, and closes by Escape', async () => {
      const chevron = chevronTab.locator('footer button[aria-label="Launchpad"]');
      const expanded = () => chevron.getAttribute('aria-expanded');
      const toBottom = async () => {
        await chevronTab.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await chevronTab.waitForTimeout(400);
      };
      await toBottom();
      await chevron.click();
      await chevronTab.waitForTimeout(700);
      assert(await expanded() === 'true', 'Click did not open Launchpad');
      await chevronTab.keyboard.press('Escape');
      await chevronTab.waitForTimeout(300);
      assert(await expanded() === 'false', 'Escape did not close Launchpad');
      assert(await chevron.evaluate((element) => document.activeElement === element), 'Escape did not return focus to the chevron');
      await chevronTab.keyboard.press('Enter');
      await chevronTab.waitForTimeout(700);
      assert(await expanded() === 'true', 'Enter did not open Launchpad');
      await chevronTab.keyboard.press('Tab');
      const first = await chevronTab.evaluate(() => ({ href: document.activeElement.getAttribute('href') }));
      assert(first.href === 'https://score.piresc.dev', `Tab did not reach the first Launchpad link: ${JSON.stringify(first)}`);
      await chevronTab.keyboard.press('Escape');
      await chevronTab.waitForTimeout(300);
      assert(await expanded() === 'false', 'Escape from a Launchpad link did not close it');
      const focus = await chevron.evaluate((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return { active: document.activeElement === element, visible: element.matches(':focus-visible'), width: parseFloat(style.outlineWidth), style: style.outlineStyle, boxWidth: rect.width, boxHeight: rect.height };
      });
      assert(focus.active && focus.visible && focus.width >= 2 && focus.style !== 'none', `Chevron has no visible keyboard focus: ${JSON.stringify(focus)}`);
      assert(focus.boxWidth >= 44 && focus.boxHeight >= 44, `Chevron is undersized: ${JSON.stringify(focus)}`);
      await toBottom();
      const box = await chevron.boundingBox();
      await chevronTab.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await chevronTab.mouse.down();
      await chevronTab.waitForTimeout(1500);
      await chevronTab.mouse.up();
      await chevronTab.waitForTimeout(800);
      assert(await expanded() === 'true', 'Press-and-hold did not leave Launchpad open (click after hold was not ignored)');
      return focus;
    });

    const reducedLaunchpad = await open({ width: 1440, height: 900 }, 'reduce');
    await reducedLaunchpad.goto(url, { waitUntil: 'domcontentloaded' });
    await settle(reducedLaunchpad);
    await check('Reduced motion opens Launchpad without transition', async () => {
      const durations = await reducedLaunchpad.locator('#launchpad-sites').evaluate((element) => getComputedStyle(element).transitionDuration.split(',').map((value) => value.trim()));
      assert(durations.every((value) => /^0(\.0+)?m?s$/.test(value)), `Launchpad drawer still transitions: ${durations}`);
      await reducedLaunchpad.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await reducedLaunchpad.waitForTimeout(300);
      await reducedLaunchpad.locator('footer button[aria-label="Launchpad"]').focus();
      await reducedLaunchpad.keyboard.press('Enter');
      await reducedLaunchpad.waitForFunction(() => document.querySelector('#launchpad-sites').getAttribute('data-open') === 'true', null, { timeout: 500, polling: 10 });
      return durations;
    });
    return { passed: checks.filter((item) => item.passed).length, failed: checks.filter((item) => !item.passed).length, checks };
  } finally {
    for (const tab of pages) await tab.close();
  }
})
