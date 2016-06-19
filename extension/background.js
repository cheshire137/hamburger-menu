function hamburgerify(info, tab) {
  const host = new URL(info.pageUrl).host;
  chrome.tabs.sendMessage(tab.id, { action: 'getClickedElement' }, selector => {
    console.debug(host, selector);
    HamburgerStorage.load().then(options => {
      if (!options.overrides) {
        options.overrides = {};
      }
      if (!options.overrides[host]) {
        options.overrides[host] = [];
      }
      if (options.overrides[host].indexOf(selector) < 0) {
        options.overrides[host].push(selector);
      }
      HamburgerStorage.save(options).then(() => {
        console.debug(options.overrides[host].length, 'override(s) for', host,
                      options.overrides[host]);
        chrome.tabs.sendMessage(tab.id,
                                { action: 'hamburgerify', selector });
      });
    });
  });
}

function constructMenu() {
  console.debug('adding hamburger context menu');
  chrome.contextMenus.create({
    title: 'Make this a hamburger',
    contexts: ['all'],
    onclick: hamburgerify
  });
}

constructMenu();
