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
    tr.appendChild(this.getOptionsCell(host, selector));
    this.overridesTbody.appendChild(tr);
  }

  getHostCell(host) {
    const hostCell = document.createElement('td');
    hostCell.textContent = host;
    hostCell.className = 'host';
    return hostCell;
  }

  getOptionsCell(host, selector) {
    const optionsCell = document.createElement('td');
    optionsCell.appendChild(this.getEditButton(host, selector));
    optionsCell.appendChild(this.getSaveButton(host, selector));
    optionsCell.appendChild(this.getRemoveButton(host, selector));
    optionsCell.appendChild(this.getCancelButton(host, selector));
    return optionsCell;
  }

  getSaveButton(host, selector) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'hidden button save-button';
    button.onclick = event => {
      this.saveSelector(event, host, selector);
    };
    button.textContent = 'Save';
    return button;
  }

  getEditButton(host, selector) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'button edit-button';
    button.onclick = event => {
      this.editSelector(event, host, selector);
    };
    button.textContent = 'Edit';
    return button;
  }

  getSelectorCell(selector) {
    const selectorCell = document.createElement('td');
    selectorCell.textContent = selector;
    selectorCell.className = 'selector';
    return selectorCell;
  }

  editSelector(event, host, selector) {
    event.preventDefault();
    const button = event.target;
    button.classList.add('hidden');
    const optionsCell = button.parentNode;
    optionsCell.querySelector('.save-button').classList.remove('hidden');
    optionsCell.querySelector('.cancel-button').classList.remove('hidden');
    optionsCell.querySelector('.remove-button').classList.add('hidden');
    const row = optionsCell.parentNode;
    const selectorCell = row.querySelector('td.selector');
    selectorCell.style.width = `${selectorCell.clientWidth}px`;
    while (selectorCell.hasChildNodes()) {
      selectorCell.removeChild(selectorCell.lastChild);
    }
    selectorCell.appendChild(this.getSelectorInput(host, selector));
  }

  getSelectorInput(host, selector) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = selector;
    input.className = 'selector-edit input';
    input.addEventListener('keypress', event => {
      if (event.keyCode === 13) { // Enter
        this.updateSelector(event, host, selector, event.target.value.trim());
      }
    });
    return input;
  }

  updateSelector(event, host, oldSelector, newSelector) {
    const input = event.target;
    input.disabled = true;
    const row = input.closest('tr');
    const index = this.options.overrides[host].indexOf(oldSelector);
    if (index < 0) {
      return;
    }
    this.replaceSelector(row, host, index, newSelector);
  }

  saveSelector(event, host, oldSelector) {
    const button = event.target;
    button.disabled = true;
    const row = button.closest('tr');
    const index = this.options.overrides[host].indexOf(oldSelector);
    if (index < 0) {
      return;
    }
    const newSelector = row.querySelector('.selector-edit').value.trim();
    this.replaceSelector(row, host, index, newSelector);
  }

  replaceSelector(row, host, index, newSelector) {
    this.options.overrides[host] = this.options.overrides[host].slice(0, index).
        concat([newSelector]).
        concat(this.options.overrides[host].slice(index + 1));
    HamburgerStorage.save(this.options).then(() => {
      row.querySelector('.edit-button.hidden').classList.remove('hidden');
      row.querySelector('.selector-edit').remove();
      row.querySelector('td.selector').textContent = newSelector;
      const saveButton = row.querySelector('.save-button');
      saveButton.disabled = false;
      saveButton.classList.add('hidden');
    });
  }

  getRemoveButton(host, selector) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'button remove-button';
    button.onclick = event => {
      this.removeSelector(event, host, selector);
    };
    button.textContent = 'Remove';
    return button;
  }

  getCancelButton(host, selector) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'button cancel-button hidden';
    button.onclick = event => {
      this.cancelEditSelector(event, host, selector);
    };
    button.textContent = 'Cancel';
    return button;
  }

  cancelEditSelector(event, host, selector) {
    const cancelButton = event.target;
    const row = cancelButton.closest('tr');
    cancelButton.classList.add('hidden');
    row.querySelector('.selector-edit').remove();
    row.querySelector('.save-button').classList.add('hidden');
    row.querySelector('.remove-button.hidden').classList.remove('hidden');
    row.querySelector('.edit-button.hidden').classList.remove('hidden');
    row.querySelector('td.selector').textContent = selector;
  }
}

window.OverridesHelper = OverridesHelper;
