(function() {
  // Font Awesome
  const faIcons = Array.from(document.querySelectorAll('.fa-bars, .fa-navicon, .fa-reorder'));

  // Octicons
  const octicons = Array.from(document.querySelectorAll('.octicon-three-bars, .octicon-grabber'));

  // Glyphicons
  const glyphicons = Array.from(document.querySelectorAll('.glyphicons-menu-hamburger, .halflings-menu-hamburger, .glyphicon-menu-hamburger'));

  // Material Icons
  const materialIcons =
      Array.from(document.querySelectorAll('.material-icons')).filter(icon => {
        return icon.textContent.trim() === 'reorder';
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
    icon.classList.add('hm-' + iconClass);
  }

  const allIcons = faIcons.concat(octicons).concat(glyphicons).
                           concat(materialIcons).concat(ionicons).
                           concat(foundIcons).concat(elusiveIcons).
                           concat(generic);
  HamburgerStorage.load().then(options => {
    const iconClass = options.icon || 'hotdog';
    allIcons.forEach(icon => setHamburgerWidth(icon, iconClass));
  });
})();
