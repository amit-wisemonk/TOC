/**
 * Enhanced Table of Contents Script
 * Version: v2.0.0 Minified
 */
"use strict";(()=>{class t{constructor(t={}){this.options={headerSelector:"h2",tocNavSelector:".toc_nav",tocLinkSelector:".toc_link",contentSelector:"#content-wrapper",activeClass:"w--current",offset:60,scrollSmoothing:!0,...t},this.init()}init(){if(this.tocNav=document.querySelector(this.options.tocNavSelector),this.content=document.querySelector(this.options.contentSelector),!this.validateSetup())return;this.setupTOC(),this.setupScrollSpy(),this.setupURLHandling(),this.setupEventListeners()}validateSetup(){if(!this.tocNav||!this.content)return console.warn("TOC: Required elements not found"),!1;const t=this.content.querySelectorAll(this.options.headerSelector);if(!t.length)return console.warn(`TOC: No ${this.options.headerSelector} headings found`),!1;return!!this.tocNav.querySelector(this.options.tocLinkSelector)||(console.warn("TOC: No TOC link template found"),!1)}setupTOC(){const t=this.content.querySelectorAll(this.options.headerSelector),e=this.tocNav.querySelector(this.options.tocLinkSelector);this.tocNav.innerHTML="",t.forEach((t,s)=>{const n=this.createTOCEntry(t,e);this.tocNav.appendChild(n)})}createTOCEntry(t,e){const s=e.cloneNode(!0);return t.id||(t.id=this.generateId(t.textContent)),s.href=`#${t.id}`,s.textContent=this.getTocTitle(t),s.addEventListener("click",e=>this.handleLinkClick(e,t)),s}setupScrollSpy(){const t={root:null,rootMargin:"-20% 0px -80% 0px",threshold:0};this.observer=new IntersectionObserver(t=>{t.forEach(t=>{const e=this.tocNav.querySelector(`[href="#${t.target.id}"]`);e&&t.isIntersecting&&(this.tocNav.querySelectorAll(this.options.tocLinkSelector).forEach(t=>t.classList.remove(this.options.activeClass)),e.classList.add(this.options.activeClass))})},t),this.content.querySelectorAll(this.options.headerSelector).forEach(t=>this.observer.observe(t))}setupURLHandling(){window.location.hash&&setTimeout(()=>{const t=window.location.hash.substring(1),e=document.getElementById(t);e&&this.scrollToElement(e,!1)},100)}setupEventListeners(){"MutationObserver"in window&&new MutationObserver(()=>{this.updateTOC()}).observe(this.content,{childList:!0,subtree:!0,characterData:!0})}handleLinkClick(t,e){t.preventDefault(),this.scrollToElement(e);const s=e.id.replace(/^#+/,"");window.history.pushState(null,null,`#${s}`)}scrollToElement(t,e=!0){const s=t.getBoundingClientRect().top+window.pageYOffset-this.options.offset;window.scrollTo({top:s,behavior:e&&this.options.scrollSmoothing?"smooth":"auto"})}getTocTitle(t){const e=t.textContent,s=e.match(/\[toc=(.*?)\]/);return s?(t.textContent=e.replace(/\[toc=.*?\]\s*/,"").trim(),s[1].trim()):e.trim()}generateId(t){return t.toLowerCase().replace(/\[toc=.*?\]/g,"").replace(/\s+/g,"-").replace(/[^\w-]/g,"").replace(/--+/g,"-").replace(/^-+|-+$/g,"")}updateTOC(){this.observer.disconnect(),this.setupTOC(),this.setupScrollSpy()}destroy(){this.observer.disconnect(),this.tocNav.querySelectorAll(this.options.tocLinkSelector).forEach(t=>{t.replaceWith(t.cloneNode(!0))})}}try{window.EnhancedTOC=new t}catch(t){console.error("TOC: Error initializing:",t)}})();
