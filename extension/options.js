class OptionsPage {
  constructor() {
    this.findElements();
  }

  findElements() {
    this.iconRadios =
        Array.from(document.querySelectorAll('input[name="icon"]'));
    this.overridesContainer = document.getElementById('overrides-container');
    this.overridesTbody = document.getElementById('overrides-tbody');
  }

  setup() {
    HamburgerStorage.load().then(options => {
      this.options = options;
      this.selectChosenIcon();
      this.listenForChanges();
      this.enableInputs();
      this.listOverrides();
    })
  }

  selectChosenIcon() {
    let checkbox;
    if (this.options.icon === 'hamburger') {
      checkbox = document.
          querySelector('input[name="icon"][value="hamburger"]');
    } else {
      checkbox = document.querySelector('input[name="icon"][value="hotdog"]');
    }
    checkbox.checked = true;
  }

  enableInputs() {
    this.iconRadios.forEach(radio => {
      radio.disabled = false;
    });
  }

  listenForChanges() {
    this.iconRadios.forEach(radio => {
      radio.addEventListener('change', this.saveOptions.bind(this));
    });
  }

  saveOptions() {
    const checkedIcon = document.querySelector('input[name="icon"]:checked');
    this.options.icon = checkedIcon.value;
    HamburgerStorage.save(this.options).then(() => {
      const label = checkedIcon.closest('.radio');
      label.classList.add('saved');
      setTimeout(() => {
        label.classList.remove('saved');
      }, 1500);
    });
  }

  listOverrides() {
    if (typeof this.options.overrides === 'undefined') {
      return;
    }
    const hosts = Object.keys(this.options.overrides);
    if (hosts.length < 1) {
      return;
    }
    this.overridesContainer.classList.remove('hidden');
    hosts.forEach(host => {
      if (this.options.overrides.hasOwnProperty(host)) {
        const selectors = this.options.overrides[host];
        selectors.forEach(selector => {
          this.listOverride(host, selector);
        });
      }
    });
  }

  removeSelector(event, host, selector) {
    const row = event.target.closest('tr');
    const index = this.options.overrides[host].indexOf(selector);
    if (index < 0) {
      return;
    }
    this.options.overrides[host] = this.options.overrides[host].slice(0, index).concat(this.options.overrides[host].slice(index + 1));
    HamburgerStorage.save(this.options).then(() => {
      row.parentNode.removeChild(row);
    });
  }

  listOverride(host, selector) {
    const tr = document.createElement('tr');
    const hostCell = document.createElement('td');
    hostCell.textContent = host;
    hostCell.className = 'host';
    const selectorCell = document.createElement('td');
    selectorCell.textContent = selector;
    selectorCell.className = 'selector';
    const removeCell = document.createElement('td');
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'button';
    removeButton.onclick = (event) => {
      this.removeSelector(event, host, selector);
    };
    removeButton.textContent = 'Remove';
    removeCell.appendChild(removeButton);
    tr.appendChild(hostCell);
    tr.appendChild(selectorCell);
    tr.appendChild(removeCell);
    this.overridesTbody.appendChild(tr);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const page = new OptionsPage();
  page.setup();
});
