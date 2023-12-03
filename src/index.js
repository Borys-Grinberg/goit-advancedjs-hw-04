import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css"

import { findImages } from './search-api';


const elements = {
    searchForm: document.querySelector('.search-form'),
    searchButton: document.querySelector('button[type="submit"]'),
    gallery: document.querySelector('.gallery'),
    guard: document.querySelector('.js-guard')
}

const PER_PAGE = 40;

let totalHits = 0;
let currentPage = 1;
let searchQuery = '';

let gallery = new SimpleLightbox(
    '.gallery a',
    {
        captionsData: 'alt',
        captionDelay: 250
    }
);
    
const guardOptions = {
    root: null,
    rootMargin: "250px",
    treshhold: 1.0
}

const scrollObserver = new IntersectionObserver(handlerLoadMore, guardOptions);

function handlerLoadMore(entries) {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            currentPage += 1;
            const searchResult = findImages(searchQuery, PER_PAGE, currentPage);
    
            searchResult
                .then(result => {                    
                    renderSearchResult(result.data);

                    if (PER_PAGE * currentPage >= totalHits) {
                        scrollObserver.unobserve(elements.guard);
                        showMessage("We're sorry, but you've reached the end of search results.");
                    }
                })
                .catch(err => showErrorMessage(err.message));
        }
    });
}



function getListItemsHTML(hits) {
    return hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
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
        `
    }).join('');
}

function renderSearchResult(data) {
    elements.gallery.insertAdjacentHTML('beforeend', getListItemsHTML(data.hits));
    gallery.refresh();

    window.scrollBy({
        top: 0,
        behavior: "smooth",
    });
}

function showErrorMessage(errorMessage) {
    iziToast.show({
        message: errorMessage,
        messageColor: 'white',
        backgroundColor: 'tomato',
        timeout: 2500,
        position: 'topRight'
    });
}

function showMessage(message) {
    iziToast.show({
        message: message,
        messageColor: 'white',
        backgroundColor: 'green',
        timeout: 3000,
        position: 'topRight'
    });
}

function resetSearchData() {
    elements.gallery.innerHTML = '';
    totalHits = 0;
    currentPage = 1;
    searchQuery = '';
}

function onSearchButtonClick(evt) {
    evt.preventDefault();
    const form = new FormData(elements.searchForm);
    const userInput = form.get('searchQuery').trim().toLowerCase();

    if (!userInput) {
        showErrorMessage("Search query must be not empty!");
        return;
    }

    scrollObserver.unobserve(elements.guard);    
    resetSearchData();

    searchQuery = userInput;
    const searchResult = findImages(searchQuery, PER_PAGE);
    
    searchResult
        .then(result => {
            if (result.data.hits.length === 0) {
                throw new Error("Sorry, there are no images matching your search query. Please try again.");
            }
            
            totalHits = result.data.totalHits;
            
            showMessage(`Hooray! We found ${totalHits} images.`);
            renderSearchResult(result.data);

            if (PER_PAGE * currentPage < totalHits) {
                scrollObserver.observe(elements.guard);
            }
        })
        .catch(err => showErrorMessage(err.message));
}

elements.searchButton.addEventListener('click', onSearchButtonClick);
