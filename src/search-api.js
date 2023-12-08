// search-api.js

import axios from 'axios';
const PIXABAY_API_KEY = '37408613-d3e7a4c0184cf3ce3e63dcb61';
const BASE_URL = 'https://pixabay.com/api/';

const IMAGE_PARAM_TEMPLATE = {
  key: PIXABAY_API_KEY,
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
};

function getSearchUrl(params) {
  return `${BASE_URL}?${params}`;
}

function getParams(query, template) {
  template.q = query;
  return new URLSearchParams(template);
}

async function fetchUrl(query, searchTemplate = { key: PIXABAY_API_KEY }) {
  const params = getParams(query, searchTemplate);
  const data = await axios.get(getSearchUrl(params));
  return data;
}

export function findImages(searchQuery, per_page = 20, page = 1) {
  IMAGE_PARAM_TEMPLATE.per_page = per_page;
  IMAGE_PARAM_TEMPLATE.page = page;

  return fetchUrl(searchQuery, IMAGE_PARAM_TEMPLATE);
}
