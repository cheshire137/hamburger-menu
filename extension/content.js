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

const allIcons = Array.from(faIcons).
                       concat(Array.from(octicons)).
                       concat(Array.from(glyphicons)).
                       concat(materialIcons).
                       concat(Array.from(ionicons));
allIcons.forEach(icon => {
  let width = icon.clientWidth;
  let height = icon.clientHeight;
  if (width > 0 && height > 0) {
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
    icon.style.width = `${width}px`;
    icon.style.height = `${height}px`;
  }
  icon.classList.add('hamburgled');
  icon.classList.add('deliciously-hamburgled');
});
