import{a as v,S as A,i as p}from"./assets/vendor-c835c9e9.js";(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function s(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerpolicy&&(o.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?o.credentials="include":t.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(t){if(t.ep)return;t.ep=!0;const o=s(t);fetch(t.href,o)}})();const g="37408613-d3e7a4c0184cf3ce3e63dcb61",S="https://pixabay.com/api/",f={key:g,q:"",image_type:"photo",orientation:"horizontal",safesearch:!0};function P(e){return`${S}?${e}`}function M(e,r){return r.q=e,new URLSearchParams(r)}async function E(e,r={key:g}){const s=M(e,r);return await v.get(P(s))}function y(e,r=20,s=1){return f.per_page=r,f.page=s,E(e,f)}const i={searchForm:document.querySelector(".search-form"),gallery:document.querySelector(".gallery"),load:document.querySelector(".js-load")},u=40;let l=0,c=1,d="",$=new A(".gallery a",{captionsData:"alt",captionDelay:250});const I={root:null,rootMargin:"250px",threshold:1},m=new IntersectionObserver(R,I);async function R(e){e.forEach(async r=>{if(r.isIntersecting){c+=1;const s=await y(d,u,c),a=Math.ceil(l/u);Array.from({length:a},(o,n)=>n+1).includes(c)&&(b(s.data),c===a&&(m.unobserve(i.load),w("You've reached the end of search results.")))}})}function _(e){return e.map(({webformatURL:r,largeImageURL:s,tags:a,likes:t,views:o,comments:n,downloads:L})=>`            
          <div class="photo-card">
            <a href="${s}"><img class="image" src="${r}" alt="${a}" loading="lazy" /></a>
            <div class="info">
              <p class="info-item">
                <b>Likes</b>
                <span>${t}</span> 
              </p>
              <p class="info-item">
                <b>Views</b>
                <span>${o}</span>
              </p>
              <p class="info-item">
                <b>Comments</b>
                <span>${n}</span>
              </p>
              <p class="info-item">
                <b>Downloads</b>
                <span>${L}</span>
              </p>
            </div>
          </div>            
        `).join("")}async function b(e){i.gallery.insertAdjacentHTML("beforeend",_(e.hits)),$.refresh(),window.scrollBy({top:0,behavior:"smooth"})}function h(e){p.show({message:e,messageColor:"white",backgroundColor:"red",timeout:2500,position:"topRight"})}function w(e){p.show({message:e,messageColor:"white",backgroundColor:"green",timeout:3e3,position:"topRight"})}function q(){i.gallery.innerHTML="",l=0,c=1,d=""}async function O(e){e.preventDefault();const s=new FormData(i.searchForm).get("searchQuery").trim().toLowerCase();if(!s){h("Search query must not be empty!");return}m.unobserve(i.load),q(),d=s;const a=await y(d,u);if(a.data.hits.length===0){h("No images match your search query. Please try again.");return}l=a.data.totalHits,w(`Hooray! We found ${l} images.`),b(a.data),u*c<l&&m.observe(i.load)}i.searchForm.addEventListener("submit",O);
//# sourceMappingURL=commonHelpers.js.map
