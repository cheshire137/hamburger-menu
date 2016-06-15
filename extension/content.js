const faIcons = document.querySelectorAll('.fa-bars');
const allIcons = Array.from(faIcons);
allIcons.forEach(icon => {
  icon.style.width = `${icon.clientWidth}px`;
  icon.style.height = `${icon.clientHeight}px`;
  icon.classList.add('hamburgled');
});
