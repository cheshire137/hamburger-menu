function hamburgerify(info, tab) {
  const host = new URL(info.pageUrl).host;
  chrome.tabs.sendMessage(tab.id, {action: 'getClickedElement'}, selector => {
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
                                {action: 'hamburgerify', selector: selector});
      });
    });
  });
}

function constructMenu() {
  HamburgerStorage.load().then(options => {
    const icon = options.icon || 'hotdog';
    chrome.contextMenus.create({
      title: `Make this a ${icon}`,
      contexts: ['all'],
      onclick: hamburgerify
    });
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'createContextMenu') {
    constructMenu();
    return true;
  }
});
