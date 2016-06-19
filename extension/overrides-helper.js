class OverridesHelper extends window.Eventful {
  constructor(opts) {
    super();
    this.options = opts.options;
    this.overridesContainer = opts.overridesContainer;
    this.overridesTbody = opts.overridesTbody;
    this.host = opts.host;
    this.showHost = opts.showHost;
  }

  hasOverrides() {
    if (typeof this.options.overrides === 'undefined') {
      return false;
    }
    if (typeof this.host === 'string') {
      return typeof this.options.overrides[this.host] === 'object' &&
             this.options.overrides[this.host].length > 0;
    }
    return Object.keys(this.options.overrides).length > 0;
  }

  listOverrides() {
    if (!this.hasOverrides()) {
      this.emit('no-overrides', this.host);
      return;
    }
    const hosts = Object.keys(this.options.overrides);
    this.overridesContainer.classList.remove('hidden');
    if (typeof this.host === 'string') {
      this.listOverridesForHost(this.host);
    } else {
      hosts.forEach(host => {
        if (this.options.overrides.hasOwnProperty(host)) {
          this.listOverridesForHost(host);
        }
      });
    }
  }

  listOverridesForHost(host) {
    const selectors = this.options.overrides[host];
    console.log('selectors', selectors);
    selectors.forEach(selector => {
      this.listOverride(host, selector);
    });
  }

  removeSelector(event, host, selector) {
    const row = event.target.closest('tr');
    const index = this.options.overrides[host].indexOf(selector);
    if (index < 0) {
      return;
    }
    this.options.overrides[host] = this.options.overrides[host].slice(0, index).
        concat(this.options.overrides[host].slice(index + 1));
    if (this.options.overrides[host].length < 1) {
      delete this.options.overrides[host];
    }
    HamburgerStorage.save(this.options).then(() => {
      const parent = row.parentNode;
      parent.removeChild(row);
      if (parent.querySelectorAll('tr').length < 1) {
        this.overridesContainer.classList.add('hidden');
        this.emit('no-overrides', host);
      }
    });
  }

  listOverride(host, selector) {
    const tr = document.createElement('tr');
    if (this.showHost) {
      tr.appendChild(this.getHostCell(host));
    }
    tr.appendChild(this.getSelectorCell(selector));
    tr.appendChild(this.getRemoveCell(host, selector));
    this.overridesTbody.appendChild(tr);
  }

  getHostCell(host) {
    const hostCell = document.createElement('td');
    hostCell.textContent = host;
    hostCell.className = 'host';
    return hostCell;
  }

  getRemoveCell(host, selector) {
    const removeCell = document.createElement('td');
    removeCell.appendChild(this.getRemoveButton(host, selector));
    return removeCell;
  }

  getSelectorCell(selector) {
    const selectorCell = document.createElement('td');
    selectorCell.textContent = selector;
    selectorCell.className = 'selector';
    return selectorCell;
  }

  getRemoveButton(host, selector) {
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'button';
    removeButton.onclick = event => {
      this.removeSelector(event, host, selector);
    };
    removeButton.textContent = 'Remove';
    return removeButton;
  }
}

window.OverridesHelper = OverridesHelper;
