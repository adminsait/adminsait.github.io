// scripts.js – динамическая загрузка контента

async function loadContent(pageId) {
    const contentContainer = document.querySelector('content');
    if (!contentContainer) return;

    let url = '';
    let heroTitle = '';

    switch (pageId) {
        case 'main':
            url = 'fragments/main.html';
            heroTitle = 'Сайт является проектом, разработанным в рамках диссертационного исследования по теме<br>«Организационно-методические основы перспективного развития региональной системы фармацевтической помощи больным остеопорозом в Пензенской области».';
            break;
        case 'medicinal-products':
            url = 'fragments/medicinal-products.html';
            heroTitle = 'Сайт является проектом, разработанным в рамках диссертационного исследования по теме <br> «Организационно-методические основы перспективного развития региональной системы фармацевтической помощи больным остеопорозом в Пензенской области».';
            break;
        case 'supplements':
            url = 'fragments/supplements.html';
            heroTitle = 'Сайт является проектом, разработанным в рамках диссертационного исследования по теме <br> «Организационно-методические основы перспективного развития региональной системы фармацевтической помощи больным остеопорозом в Пензенской области».';
            break;
        case 'makers':
            url = 'fragments/makers.html';
            heroTitle = 'Сайт является проектом, разработанным в рамках диссертационного исследования по теме <br> «Организационно-методические основы перспективного развития региональной системы фармацевтической помощи больным остеопорозом в Пензенской области».';
            break;
        case 'questionnaire':
            url = 'fragments/questionnaire.html';
            heroTitle = 'Сайт является проектом, разработанным в рамках диссертационного исследования по теме <br> «Организационно-методические основы перспективного развития региональной системы фармацевтической помощи больным остеопорозом в Пензенской области».';
            break;
        case 'clinical-recommendations':
            url = 'fragments/clinical-recommendations.html';
            heroTitle = 'Сайт является проектом, разработанным в рамках диссертационного исследования по теме <br> «Организационно-методические основы перспективного развития региональной системы фармацевтической помощи больным остеопорозом в Пензенской области».';
            break;
        case 'materials':
            url = 'fragments/materials.html';
            heroTitle = 'Сайт является проектом, разработанным в рамках диссертационного исследования по теме <br> «Организационно-методические основы перспективного развития региональной системы фармацевтической помощи больным остеопорозом в Пензенской области».';
            break;
        default:
            return;
    }

    const heroTextP = document.querySelector('.hero-text p');
    if (heroTextP) heroTextP.innerHTML = heroTitle;

    contentContainer.innerHTML = '<div class="text-center my-5"><div class="spinner-border text-primary"></div><p class="mt-2">Загрузка...</p></div>';

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const html = await response.text();
        contentContainer.innerHTML = html;
        reinitWidgets();
    } catch (error) {
        console.error(error);
        contentContainer.innerHTML = `<div class="alert alert-danger">Не удалось загрузить содержимое. Файл ${url} не найден.</div>`;
    }
}

function reinitWidgets() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');
    let table = document.getElementById('drugTable') || document.getElementById('badTable') || document.getElementById('manufacturerTable') || document.querySelector('.med-table');
    
    if (searchInput && table) {
        const rows = Array.from(table.querySelectorAll('tbody tr'));
        const filterTable = () => {
            const term = searchInput.value.toLowerCase().trim();
            rows.forEach(row => {
                if (row.classList && row.classList.contains('section-header')) {
                    row.style.display = '';
                    return;
                }
                row.style.display = row.innerText.toLowerCase().includes(term) ? '' : 'none';
            });
        };
        searchInput.removeEventListener('input', filterTable);
        searchInput.addEventListener('input', filterTable);
        if (clearBtn) {
            clearBtn.removeEventListener('click', filterTable);
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                filterTable();
            });
        }
        filterTable();
    }

    const slidesContainer = document.getElementById('slides');
    if (slidesContainer) {
        initSlider();
    }
}

function initSlider() {
    const slidesContainer = document.getElementById('slides');
    const slides = Array.from(document.querySelectorAll('.slide'));
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const dotsContainer = document.getElementById('dotsContainer');
    if (!slidesContainer || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    function updateSlider() {
        slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        document.querySelectorAll('.dot').forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    }
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateSlider();
            });
            dotsContainer.appendChild(dot);
        }
    }
    createDots();
    const newPrev = prevBtn.cloneNode(true);
    const newNext = nextBtn.cloneNode(true);
    if (prevBtn) prevBtn.parentNode.replaceChild(newPrev, prevBtn);
    if (nextBtn) nextBtn.parentNode.replaceChild(newNext, nextBtn);
    newPrev.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    });
    newNext.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    });
}

function initDynamicContent() {
    const navLinks = document.querySelectorAll('a[data-page]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            if (page) {
                loadContent(page);
                history.pushState({ page }, '', `?page=${page}`);
            }
        });
    });

    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.page) {
            loadContent(event.state.page);
        } else {
            const contentContainer = document.querySelector('content');
            if (contentContainer) contentContainer.innerHTML = '';
            const heroTextP = document.querySelector('.hero-text p');
            if (heroTextP) heroTextP.innerHTML = 'Сайт является проектом, разработанным в рамках диссертационного исследования по теме<br>«Организационно-методические основы перспективного развития региональной системы фармацевтической помощи больным остеопорозом в Пензенской области».';
        }
    });


    const urlParams = new URLSearchParams(window.location.search);
    const startPage = urlParams.get('page');
    if (startPage && ['medicinal-products','supplements','makers','questionnaire','clinical-recommendations','materials'].includes(startPage)) {
        loadContent(startPage);
    } else {
        loadContent('main');
    }
}

document.addEventListener('DOMContentLoaded', initDynamicContent);