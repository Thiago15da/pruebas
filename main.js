const navigation = document.querySelector('#navigation');
const menuToggle = document.querySelector('.menu-toggle');
const mobileLayout = window.matchMedia('(max-width: 650px)');

function setMenu(open) {
  navigation.dataset.collapsed = String(!open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  menuToggle.querySelector('use').setAttribute('href', open ? '#close' : '#menu');
}

function updateMenu() {
  menuToggle.hidden = !mobileLayout.matches;
  setMenu(false);
}

updateMenu();
mobileLayout.addEventListener('change', updateMenu);
menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
navigation.addEventListener('click', (event) => {
  if (mobileLayout.matches && event.target.closest('a')) setMenu(false);
});
document.querySelector('.site-header').addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuToggle.focus();
  }
});

const projects = Array.from(document.querySelectorAll('.project'));
const filters = Array.from(document.querySelectorAll('[data-filter]'));
const projectCount = document.querySelector('#project-count');

function filterProjects(category) {
  for (const filter of filters) {
    filter.setAttribute('aria-pressed', String(filter.dataset.filter === category));
  }
  let visibleCount = 0;
  for (const project of projects) {
    project.hidden = category !== 'todos' && project.dataset.category !== category;
    if (!project.hidden) visibleCount += 1;
  }
  projectCount.textContent = `${String(visibleCount).padStart(2, '0')} ${visibleCount === 1 ? 'proyecto' : 'proyectos'}`;
}

for (const filter of filters) {
  filter.addEventListener('click', () => filterProjects(filter.dataset.filter));
}
document.querySelector('.work-tools').hidden = false;

const dialog = document.querySelector('#project-dialog');
const dialogImage = document.querySelector('#dialog-image');
let dialogTrigger;

function openProject(projectId, trigger) {
  const project = document.getElementById(projectId);
  const image = project.querySelector('img');
  dialogImage.src = image.src;
  dialogImage.alt = image.alt;
  document.querySelector('#dialog-category').textContent = project.querySelector('.project-tag').textContent;
  document.querySelector('#dialog-title').textContent = project.querySelector('h3').textContent;
  document.querySelector('#dialog-location').textContent = project.querySelector('.project-location').textContent;
  document.querySelector('#dialog-area').textContent = project.dataset.area;
  document.querySelector('#dialog-description').textContent = project.dataset.description;
  document.querySelector('#dialog-source').href = project.querySelector('.project-link').href;
  dialogTrigger = trigger;
  dialog.showModal();
  dialog.scrollTop = 0;
}

function handleProjectLink(event) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !dialog.showModal) return;
  event.preventDefault();
  openProject(event.currentTarget.dataset.projectLink, event.currentTarget);
}

for (const link of document.querySelectorAll('[data-project-link]')) {
  link.addEventListener('click', handleProjectLink);
}
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => dialogTrigger?.focus());

const heroProjects = ['ciervo', 'cauce', 'altos'];
const heroImage = document.querySelector('#hero-image');
const heroProjectLink = document.querySelector('#hero-project');
const heroProjectName = document.querySelector('#hero-project-name').firstChild;
const slideNumber = document.querySelector('#slide-current');
const heroControls = document.querySelector('.hero-controls');
let currentSlide = 0;

function showSlide(offset) {
  currentSlide = (currentSlide + offset + heroProjects.length) % heroProjects.length;
  const project = document.getElementById(heroProjects[currentSlide]);
  heroImage.src = project.querySelector('img').src;
  heroProjectLink.href = `#${project.id}`;
  heroProjectLink.dataset.projectLink = project.id;
  heroProjectName.nodeValue = project.querySelector('h3').textContent + ' ';
  slideNumber.textContent = String(currentSlide + 1).padStart(2, '0');
}

heroProjectLink.dataset.projectLink = heroProjects[0];
heroProjectLink.addEventListener('click', handleProjectLink);
heroControls.querySelector('.previous').addEventListener('click', () => showSlide(-1));
heroControls.querySelector('.next').addEventListener('click', () => showSlide(1));
heroControls.hidden = false;

const topic = document.querySelector('#contact-topic');
const whatsapp = document.querySelector('#whatsapp');
const whatsappBase = whatsapp.href;
topic.hidden = false;
topic.labels[0].hidden = false;
topic.addEventListener('change', () => {
  const message = topic.value
    ? `Hola, Biocons. Quisiera consultar sobre ${topic.value.toLowerCase()}.`
    : 'Hola, Biocons. Quisiera conversar sobre un proyecto.';
  whatsapp.href = `${whatsappBase}?text=${encodeURIComponent(message)}`;
});
