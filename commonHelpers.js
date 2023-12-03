import{a as v,S,i as g}from"./assets/vendor-b9d7420c.js";(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function s(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerpolicy&&(o.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?o.credentials="include":e.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(e){if(e.ep)return;e.ep=!0;const o=s(e);fetch(e.href,o)}})();const p="37408613-d3e7a4c0184cf3ce3e63dcb61",E="https://pixabay.com/api/",f={key:p,q:"",image_type:"photo",orientation:"horizontal",safesearch:!0};function P(t){return`${E}?${t}`}function A(t,r){return r.q=t,new URLSearchParams(r)}async function M(t,r={key:p}){const s=A(t,r);return await v.get(P(s))}function y(t,r=20,s=1){return f.per_page=r,f.page=s,M(t,f)}const a={searchForm:document.querySelector(".search-form"),searchButton:document.querySelector('button[type="submit"]'),gallery:document.querySelector(".gallery"),guard:document.querySelector(".js-guard")},u=40;let c=0,l=1,d="",R=new S(".gallery a",{captionsData:"alt",captionDelay:250});const $={root:null,rootMargin:"250px",treshhold:1},h=new IntersectionObserver(q,$);function q(t){t.forEach(r=>{r.isIntersecting&&(l+=1,y(d,u,l).then(n=>{b(n.data),u*l>=c&&(h.unobserve(a.guard),w("We're sorry, but you've reached the end of search results."))}).catch(n=>m(n.message)))})}function I(t){return t.map(({webformatURL:r,largeImageURL:s,tags:n,likes:e,views:o,comments:i,downloads:L})=>`            
                <div class="photo-card">
                    <a href="${s}"><img class="image" src="${r}" alt="${n}" loading="lazy" /></a>
                    <div class="info">
                        <p class="info-item">
                            <b>Likes</b>
                            <span>${e}</span> 
                        </p>
                        <p class="info-item">
                            <b>Views</b>
                            <span>${o}</span>
                        </p>
                        <p class="info-item">
                            <b>Comments</b>
                            <span>${i}</span>
                        </p>
                        <p class="info-item">
                            <b>Downloads</b>
                            <span>${L}</span>
                        </p>
                    </div>
                </div>            
        `).join("")}function b(t){a.gallery.insertAdjacentHTML("beforeend",I(t.hits)),R.refresh(),window.scrollBy({top:0,behavior:"smooth"})}function m(t){g.show({message:t,messageColor:"white",backgroundColor:"red",timeout:2500,position:"topRight"})}function w(t){g.show({message:t,messageColor:"white",backgroundColor:"green",timeout:3e3,position:"topRight"})}function _(){a.gallery.innerHTML="",c=0,l=1,d=""}function k(t){t.preventDefault();const s=new FormData(a.searchForm).get("searchQuery").trim().toLowerCase();if(!s){m("Search query must be not empty!");return}h.unobserve(a.guard),_(),d=s,y(d,u).then(e=>{if(e.data.hits.length===0)throw new Error("Sorry, there are no images matching your search query. Please try again.");c=e.data.totalHits,w(`Hooray! We found ${c} images.`),b(e.data),u*l<c&&h.observe(a.guard)}).catch(e=>m(e.message))}a.searchButton.addEventListener("click",k);
//# sourceMappingURL=commonHelpers.js.map
