/**
 * Table of Contents Script for Webflow
 * Version: v1.0.1
 * Changes:
 * - Added custom attributes for TOC elements (toc-element="link|content")
 * - Added inline attributes for content control ([toc-hide], [toc=CustomTitle])
 * - Added custom offset attributes (toc-offsettop, toc-offsetbottom)
 * - Added scroll behavior control (toc-scroll)
 * - Improved ID handling
 */
<script>
"use strict";
(() => {
    class TOC {
        constructor(options = {}) {
            this.options = {
                headerSelector: "h2",
                tocElement: '[toc-element="link"]',
                contentElement: '[toc-element="content"]',
                activeClass: "w--current",
                defaultOffsetTop: "6rem",
                scrollSmoothing: true,
                ...options
            };
            this.init();
        }

        init() {
            this.tocNav = document.querySelector(this.options.tocElement);
            this.content = document.querySelector(this.options.contentElement);
            
            if (!this.validateSetup()) return;
            
            this.setupTOC();
            this.setupScrollSpy();
            this.setupURLHandling();
            this.setupEventListeners();
        }

        validateSetup() {
            if (!this.tocNav || !this.content) {
                console.warn("TOC: Required elements not found. Check toc-element attributes.");
                return false;
            }

            const headers = this.getValidHeaders();
            if (!headers.length) {
                console.warn(`TOC: No valid ${this.options.headerSelector} headings found`);
                return false;
            }

            return true;
        }

        getValidHeaders() {
            return Array.from(this.content.querySelectorAll(this.options.headerSelector))
                .filter(header => !header.textContent.includes('[toc-hide]'));
        }

        setupTOC() {
            const headers = this.getValidHeaders();
            this.tocNav.innerHTML = "";
            
            headers.forEach((header) => {
                const link = document.createElement('a');
                link.setAttribute('toc-element', 'link');
                link.className = 'toc_link';
                
                // Handle custom title or use default text
                const titleMatch = header.textContent.match(/\[toc=(.*?)\]/);
                const title = titleMatch ? 
                    titleMatch[1].trim() : 
                    header.textContent.replace(/\[.*?\]/g, '').trim();
                
                link.textContent = title;
                
                // Generate or use existing ID
                if (!header.id) {
                    header.id = this.generateId(title);
                }
                link.href = `#${header.id}`;
                
                link.addEventListener('click', (e) => this.handleLinkClick(e, header));
                this.tocNav.appendChild(link);
            });
        }

        setupScrollSpy() {
            const options = {
                root: null,
                rootMargin: this.calculateRootMargin(),
                threshold: 0
            };

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const link = this.tocNav.querySelector(`[href="#${entry.target.id}"]`);
                    if (link && entry.isIntersecting) {
                        this.tocNav.querySelectorAll('[toc-element="link"]')
                            .forEach(el => el.classList.remove(this.options.activeClass));
                        link.classList.add(this.options.activeClass);
                    }
                });
            }, options);

            this.getValidHeaders().forEach(header => this.observer.observe(header));
        }

        calculateRootMargin() {
            const topOffset = this.content.getAttribute('toc-offsettop') || this.options.defaultOffsetTop;
            const bottomOffset = this.content.getAttribute('toc-offsetbottom') || '0px';
            return `-${topOffset} 0px -${bottomOffset} 0px`;
        }

        handleLinkClick(e, header) {
            e.preventDefault();
            
            const shouldSmooth = this.content.getAttribute('toc-scroll') !== 'false';
            this.scrollToElement(header, shouldSmooth);
            
            const cleanId = header.id.replace(/^#+/, '');
            window.history.pushState(null, null, `#${cleanId}`);
        }

        scrollToElement(element, smooth = true) {
            const topOffset = parseFloat(this.content.getAttribute('toc-offsettop')) || 
                parseFloat(this.options.defaultOffsetTop);
            
            const offsetPx = topOffset * parseFloat(getComputedStyle(document.documentElement).fontSize);
            
            const top = element.getBoundingClientRect().top + window.pageYOffset - offsetPx;
            
            window.scrollTo({
                top,
                behavior: smooth && this.options.scrollSmoothing ? 'smooth' : 'auto'
            });
        }

        generateId(text) {
            return text.toLowerCase()
                .replace(/\[.*?\]/g, '')
                .replace(/\s+/g, '-')
                .replace(/[^\w-]/g, '')
                .replace(/--+/g, '-')
                .replace(/^-+|-+$/g, '');
        }

        setupURLHandling() {
            if (window.location.hash) {
                setTimeout(() => {
                    const id = window.location.hash.substring(1);
                    const element = document.getElementById(id);
                    if (element) {
                        this.scrollToElement(element, false);
                    }
                }, 100);
            }
        }

        setupEventListeners() {
            if ('MutationObserver' in window) {
                new MutationObserver(() => {
                    this.updateTOC();
                }).observe(this.content, {
                    childList: true,
                    subtree: true,
                    characterData: true
                });
            }
        }

        updateTOC() {
            this.observer.disconnect();
            this.setupTOC();
            this.setupScrollSpy();
        }

        destroy() {
            this.observer.disconnect();
            this.tocNav.querySelectorAll('[toc-element="link"]')
                .forEach(link => {
                    link.replaceWith(link.cloneNode(true));
                });
        }
    }

    try {
        window.TOC = new TOC();
    } catch (error) {
        console.error('TOC: Error initializing:', error);
    }
})();
</script>
