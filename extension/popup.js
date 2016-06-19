class PopupPage {
  constructor() {
    this.findElements();
  }

  findElements() {
    this.loadingMessage = document.getElementById('loading-message');
    this.overridesContainer = document.getElementById('overrides-container');
    this.overridesTbody = document.getElementById('overrides-tbody');
    this.noOverridesMessage = document.getElementById('no-overrides-message');
    this.hostElements = Array.from(document.querySelectorAll('.host'));
    this.links = Array.from(document.querySelectorAll('a'));
    this.noOverridesOptionsPageMessage =
        document.getElementById('no-overrides-options-message');
  }

  setup() {
    HamburgerStorage.load().then(this.onOptionsLoaded.bind(this));
    this.links.forEach(link => this.handleClick(link));
  }

  handleClick(link) {
    link.addEventListener('click', event => {
      event.preventDefault();
      const href = link.href;
      let url;
      const optionsSuffix = '#options';
      if (href.indexOf(optionsSuffix) === href.length - optionsSuffix.length) {
        url = chrome.extension.getURL('options.html');
      } else {
        url = link.href;
      }
      chrome.tabs.create({ url });
      return false;
    });
  }

  onOptionsLoaded(options) {
    this.options = options;
    this.showHostOverrides();
    this.loadingMessage.classList.add('hidden');
  }

  showHostOverrides() {
    this.getActiveTabHost().then(tabInfo => {
      this.hostElements.forEach(el => {
        el.textContent = tabInfo.host;
      });
      this.overridesHelper = new window.OverridesHelper({
        options: this.options,
        overridesTbody: this.overridesTbody,
        overridesContainer: this.overridesContainer,
        showHost: false,
        host: tabInfo.host,
        confirmDelete: false
      });
      this.overridesHelper.addListener('no-overrides', () => {
        if (tabInfo.isOptionsPage) {
          this.noOverridesOptionsPageMessage.classList.remove('hidden');
        } else {
          this.noOverridesMessage.classList.remove('hidden');
        }
      });
      this.overridesHelper.listOverrides();
    });
  }

  getActiveTabHost() {
    return new Promise(resolve => {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const optionsUrl = chrome.extension.getURL('options.html');
        const tabUrl = tabs[0].url;
        resolve({
          host: new URL(tabUrl).host,
          isOptionsPage: optionsUrl === tabUrl
        });
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const page = new PopupPage();
  page.setup();
});
