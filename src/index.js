import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { findImages } from './search-api';

const elements = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  load: document.querySelector('.js-load'),
};

const PER_PAGE = 40;

let totalHits = 0;
let currentPage = 1;
let searchQuery = '';

let gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const guardOptions = {
  root: null,
  rootMargin: '250px',
  threshold: 1.0,
};

const scrollObserver = new IntersectionObserver(handlerLoadMore, guardOptions);

async function handlerLoadMore(entries) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      currentPage += 1;
      const searchResult = await findImages(searchQuery, PER_PAGE, currentPage);

      const totalPages = Math.ceil(totalHits / PER_PAGE);
      const pagesArray = Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );

      if (pagesArray.includes(currentPage)) {
        renderSearchResult(searchResult.data);

        if (currentPage === totalPages) {
          scrollObserver.unobserve(elements.load);
          showMessage("You've reached the end of search results.");
        }
      }
    }
  });
}

function getListItemsHTML(hits) {
  return hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `            
          <div class="photo-card">
            <a href="${largeImageURL}"><img class="image" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
            <div class="info">
              <p class="info-item">
                <b>Likes</b>
                <span>${likes}</span> 
              </p>
              <p class="info-item">
                <b>Views</b>
                <span>${views}</span>
              </p>
              <p class="info-item">
                <b>Comments</b>
                <span>${comments}</span>
              </p>
              <p class="info-item">
                <b>Downloads</b>
                <span>${downloads}</span>
              </p>
            </div>
          </div>            
        `;
      }
    )
    .join('');
}

async function renderSearchResult(data) {
  elements.gallery.insertAdjacentHTML('beforeend', getListItemsHTML(data.hits));
  gallery.refresh();

  window.scrollBy({
    top: 0,
    behavior: 'smooth',
  });
}

function showErrorMessage(errorMessage) {
  iziToast.show({
    message: errorMessage,
    messageColor: 'white',
    backgroundColor: 'red',
    timeout: 2500,
    position: 'topRight',
  });
}

function showMessage(message) {
  iziToast.show({
    message: message,
    messageColor: 'white',
    backgroundColor: 'green',
    timeout: 3000,
    position: 'topRight',
  });
}

function resetSearchData() {
  elements.gallery.innerHTML = '';
  totalHits = 0;
  currentPage = 1;
  searchQuery = '';
}

async function onSearchFormSubmit(evt) {
  evt.preventDefault();
  const form = new FormData(elements.searchForm);
  const userInput = form.get('searchQuery').trim().toLowerCase();

  if (!userInput) {
    showErrorMessage('Search query must not be empty!');
    return;
  }

  scrollObserver.unobserve(elements.load);
  resetSearchData();

  searchQuery = userInput;
  const searchResult = await findImages(searchQuery, PER_PAGE);

  if (searchResult.data.hits.length === 0) {
    showErrorMessage('No images match your search query. Please try again.');
    return;
  }

  totalHits = searchResult.data.totalHits;
  showMessage(`Hooray! We found ${totalHits} images.`);
  renderSearchResult(searchResult.data);

  const totalPages = Math.ceil(totalHits / PER_PAGE);
  if (PER_PAGE * currentPage < totalHits) {
    scrollObserver.observe(elements.load);
  }
}

elements.searchForm.addEventListener('submit', onSearchFormSubmit);
