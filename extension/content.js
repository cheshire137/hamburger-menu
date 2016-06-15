// Font Awesome
const faIcons = document.querySelectorAll('.fa-bars, .fa-navicon, .fa-reorder');

// Octicons
const octicons = document.querySelectorAll('.octicon-three-bars');

const allIcons = Array.from(faIcons).concat(Array.from(octicons));
allIcons.forEach(icon => {
  icon.style.width = `${icon.clientWidth}px`;
  icon.style.height = `${icon.clientHeight}px`;
  icon.classList.add('hamburgled');
});
