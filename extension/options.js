class OptionsPage {
  constructor() {
    this.findElements();
  }

  findElements() {
    this.iconRadios =
        Array.from(document.querySelectorAll('input[name="icon"]'));
  }

  setup() {
    HamburgerStorage.load().then(options => {
      this.options = options;
      this.selectChosenIcon();
      this.listenForChanges();
      this.enableInputs();
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
}

document.addEventListener('DOMContentLoaded', () => {
  const page = new OptionsPage();
  page.setup();
});
