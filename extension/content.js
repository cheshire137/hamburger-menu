(function() {
  // Font Awesome
  const faIcons = Array.from(document.querySelectorAll('.fa-bars, .fa-navicon, .fa-reorder'));

  // Octicons
  const octicons = Array.from(document.querySelectorAll('.octicon-three-bars, .octicon-grabber'));

  // Glyphicons
  const glyphicons = Array.from(document.querySelectorAll('.glyphicons-menu-hamburger, .halflings-menu-hamburger, .glyphicon-menu-hamburger'));

  // Material Icons
  const materialIcons =
      Array.from(document.querySelectorAll('.material-icons')).
            filter(icon => {
              const text = icon.textContent.trim();
              return text === 'reorder' || text === 'menu';
            });

  // Ionicons
  const ionicons = Array.from(document.querySelectorAll('.ion-navicon-round, .ion-navicon, .ion-drag'));

  // Foundation
  const foundIcons = Array.from(document.querySelectorAll('.fi-list'));

  // Elusive
  const elusiveIcons = Array.from(document.querySelectorAll('.el-lines'));

  // As seen on http://www.teehanlax.com/
  const generic = Array.from(document.querySelectorAll('.icon.hamburger'));

  const beforeStyleIcons = faIcons.concat(octicons).concat(glyphicons).
                                   concat(materialIcons).concat(ionicons).
                                   concat(foundIcons).concat(elusiveIcons).
                                   concat(generic);

  beforeStyleIcons.forEach(icon => {
    icon.classList.add('hm-before-style');
  });

  function removePadding(icon, width, height) {
    let style;
    try {
      style = window.getComputedStyle(icon);
    } catch (err) {
      style = {};
    }
    if (style.paddingLeft) {
      width -= parseFloat(style.paddingLeft.replace(/px$/, ''));
    }
    if (style.paddingRight) {
      width -= parseFloat(style.paddingRight.replace(/px$/, ''));
    }
    if (style.paddingTop) {
      height -= parseFloat(style.paddingTop.replace(/px$/, ''));
    }
    if (style.paddingBottom) {
      height -= parseFloat(style.paddingBottom.replace(/px$/, ''));
    }
    return [width, height];
  }

  function squareItUp(width, height) {
    if (width > 0 && height <= 0) {
      height = width;
    } else if (height > 0 && width <= 0) {
      width = height;
    }
    return [width, height];
  }

  function setHamburgerWidth(icon, iconClass) {
    let width = icon.clientWidth;
    let height = icon.clientHeight;
    [width, height] = removePadding(icon, width, height);
    if (width <= 0 && height <= 0 && icon.parentNode) {
      height = icon.parentNode.clientHeight;
    }
    if (width && width < 10) {
      width = icon.parentNode.clientWidth;
    }
    [width, height] = squareItUp(width, height);
    if (width > 0) {
      icon.style.width = `${width}px`;
    }
    if (height > 0) {
      icon.style.height = `${height}px`;
    }
    if (icon.style.display === '') {
      icon.style.display = 'inline-block';
    }
    icon.classList.add('hamburgled');
    icon.classList.add(`hm-${iconClass}`);
  }

  function hamburgerify(selector) {
    HamburgerStorage.load().then(options => {
      const iconClass = options.icon || 'hotdog';
      Array.from(document.querySelectorAll(selector)).forEach(el => {
        if (el.nodeName === 'IMG') {
          el.setAttribute('data-unhamburgerified-src', el.src);
          el.src = chrome.extension.getURL(`${iconClass}.png`);
        } else {
          setHamburgerWidth(el, iconClass);
          const style = window.getComputedStyle(el);
          if (style.display === 'inline' || el.classList.contains('fa')) {
            el.classList.add('hm-inline-style');
          } else {
            el.classList.add('hm-block-style');
          }
        }
      });
    });
  }

  const allIcons = faIcons.concat(octicons).concat(glyphicons).
                           concat(materialIcons).concat(ionicons).
                           concat(foundIcons).concat(elusiveIcons).
                           concat(generic);
  HamburgerStorage.load().then(options => {
    const iconClass = options.icon || 'hotdog';
    const host = window.location.host;
    allIcons.forEach(icon => setHamburgerWidth(icon, iconClass));
    if (options.overrides && options.overrides[host]) {
      options.overrides[host].forEach(selector => hamburgerify(selector));
    }
  });

  function getRightClickTarget(el) {
    if (el.nodeName === 'PATH') {
      return el.closest('svg');
    }
    return el;
  }

  let clickedEl = null;
  document.addEventListener('mousedown', event => {
    if (event.button === 2) { // Right click
      clickedEl = getRightClickTarget(event.target);
    }
  });

  const hamburgerClasses = ['hamburgled', 'hm-before-style', 'hm-hotdog',
                            'hm-hamburger', 'hm-inline-style',
                            'hm-block-style'];

  function describeElement(el) {
    if (el.id) {
      return `#${el.id}`;
    }
    if (el.classList) {
      let classes = Array.from(el.classList);
      if (classes.length > 0) {
        classes = classes.filter(c => {
          return c.length > 0 && hamburgerClasses.indexOf(c) < 0;
        });
        return `.${classes.join('.')}`;
      }
    }
    if (el.parentNode) {
      return el.nodeName.toLowerCase();
    }
  }

  function getElementSelector(el) {
    if (!el) {
      return null;
    }
    const selectors = [];
    let selector = describeElement(el);
    if (selector) {
      selectors.push(selector);
    }
    let parent = el.parentNode;
    while (parent) {
      selector = describeElement(parent);
      if (selector) {
        selectors.push(selector);
      }
      parent = parent.parentNode;
    }
    if (selectors.length < 1) {
      return null;
    }
    return selectors.reverse().join(' ');
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getClickedElement') {
      const selector = getElementSelector(clickedEl);
      sendResponse(selector);
      return true;
    }
    if (request.action === 'hamburgerify') {
      hamburgerify(request.selector);
      sendResponse();
      return true;
    }
  });
})();
