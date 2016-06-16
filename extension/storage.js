class HamburgerStorage {
  static load() {
    return new Promise(resolve => {
      chrome.storage.sync.get('hamburgerMenu', allOptions => {
        const options = allOptions.hamburgerMenu || {};
        console.debug('loaded options', options);
        resolve(options);
      });
    });
  }

  static save(opts) {
    return new Promise(resolve => {
      console.debug('saving options', opts);
      chrome.storage.sync.set({ hamburgerMenu: opts }, () => {
        resolve();
      });
    });
  }
}

window.HamburgerStorage = HamburgerStorage;
