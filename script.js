async function loadComics() {
    const response = await fetch('data/comics.json');
    const comics = await response.json();
    return comics;
}

async function renderHomePage() {
    const comics = await loadComics();
    const container = document.querySelector('.comics-list');

    container.innerHTML = comics.map(comic => `
        <div class="comic-item">
            <img src="${comic.cover}" alt="${comic.title}" class="comic-cover" loading="lazy">
            <div class="comic-info">
                <div class="comic-text">
                    <a href="comic.html?id=${comic.id}" class="comic-title">${comic.title}</a>
                    <div class="comic-author">Автор: ${comic.author}</div>
                </div>
            </div>
        </div>
    `).join('');
}

async function renderComicPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const comicId = parseInt(urlParams.get('id'));

    const comics = await loadComics();
    const comic = comics.find(c => c.id === comicId);

    document.title = `${comic.title} — Интересная Классика`;
    const detailContainer = document.getElementById('comic-detail');
    detailContainer.innerHTML = `
        <div class="comic-detail-card">
            <div class="comic-detail-header">
                <img src="${comic.cover}" alt="${comic.title}" class="detail-cover">
                <div>
                    <h1 class="detail-title">${comic.title}</h1>
                    <div class="details">
                        Автор: ${comic.author}<br>
                        Сценарий: ${comic.writers}<br>
                        Дизайн: ${comic.design}<br>
                        Год издания: ${comic.year}
                    </div>
                    <p class="detail-description">${comic.description}</p>
                    <a href="${comic.pdf}" class="download-btn" download>Скачать PDF</a>
                </div>
            </div>
            <div class="comic-gallery">
                <h3>Галерея</h3>
                <div class="gallery-images">
                    ${comic.preview.map(img => `<img src="${img}" alt="Превью" class="gallery-image">`).join('')}
                </div>
            </div>        
        </div>
    `;
}

if (document.querySelector('.comics-list')) {
    renderHomePage();
} else {
    renderComicPage();
}

document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');

    function openLightbox(imageSrc) {
        lightboxImg.src = imageSrc;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
        lightboxImg.src = '';
        document.body.style.overflow = '';
    }

    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('gallery-image')) {
            openLightbox(e.target.src);
        }
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
            closeLightbox();
        }
    });
});