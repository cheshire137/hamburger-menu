(function() {
  // Font Awesome
  const faIcons = document.querySelectorAll('.fa-bars, .fa-navicon, .fa-reorder');

  // Octicons
  const octicons = document.querySelectorAll('.octicon-three-bars, .octicon-grabber');

  // Glyphicons
  const glyphicons = document.querySelectorAll('.glyphicons-menu-hamburger, .halflings-menu-hamburger, .glyphicon-menu-hamburger');

  // Material Icons
  const materialIcons =
      Array.from(document.querySelectorAll('.material-icons')).filter(icon => {
        return icon.textContent.trim() === 'reorder';
      });

  // Ionicons
  const ionicons = document.querySelectorAll('.ion-navicon-round, .ion-navicon, .ion-drag');

  // Foundation
  const foundIcons = document.querySelectorAll('.fi-list');

  // Elusive
  const elusiveIcons = document.querySelectorAll('.el-lines');

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

  function setHamburgerWidth(icon) {
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
    icon.classList.add('deliciously-hamburgled');
  }

  const allIcons = Array.from(faIcons).
                         concat(Array.from(octicons)).
                         concat(Array.from(glyphicons)).
                         concat(materialIcons).
                         concat(Array.from(ionicons)).
                         concat(Array.from(foundIcons)).
                         concat(Array.from(elusiveIcons));
  allIcons.forEach(icon => setHamburgerWidth(icon));
})()
