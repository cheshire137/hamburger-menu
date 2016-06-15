// Font Awesome
const faIcons = document.querySelectorAll('.fa-bars, .fa-navicon, .fa-reorder');

// Octicons
const octicons = document.querySelectorAll('.octicon-three-bars');

// Glyphicons
const glyphicons = document.querySelectorAll('.glyphicons-menu-hamburger');

const allIcons = Array.from(faIcons).concat(Array.from(octicons)).
                       concat(Array.from(glyphicons));
allIcons.forEach(icon => {
  icon.style.width = `${icon.clientWidth}px`;
  icon.style.height = `${icon.clientHeight}px`;
  icon.classList.add('hamburgled');
  icon.classList.add('deliciously-hamburgled');
});
