// Font Awesome
const faIcons = document.querySelectorAll('.fa-bars, .fa-navicon, .fa-reorder');

// Octicons
const octicons = document.querySelectorAll('.octicon-three-bars');

// Glyphicons
const glyphicons = document.querySelectorAll('.glyphicons-menu-hamburger, .halflings-menu-hamburger, .glyphicon-menu-hamburger');

// Material Icons
const materialIcons =
    Array.from(document.querySelectorAll('.material-icons')).filter(icon => {
      return icon.textContent.trim() === 'reorder';
    });

const allIcons = Array.from(faIcons).concat(Array.from(octicons)).
                       concat(Array.from(glyphicons)).
                       concat(materialIcons);
allIcons.forEach(icon => {
  const width = icon.clientWidth;
  const height = icon.clientHeight;
  if (width > 0 && height > 0) {
    icon.style.width = `${width}px`;
    icon.style.height = `${height}px`;
  }
  icon.classList.add('hamburgled');
  icon.classList.add('deliciously-hamburgled');
});
