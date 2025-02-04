/**
 * Webflow Table of Contents Script
 * Version: 1.1
 * 
 * Designed for Webflow structure:
 * <div class="toc_nav"> 
 *   <a class="toc_link" href="#section-id">Section Title</a>
 * </div>
 * 
 * Changes in 1.1:
 * - Only detects H2 headings
 * - Uses content-wrapper ID
 * - Maintains exact TOC HTML structure
 */

<script>
class TOC {
    constructor() {
        // Select base elements
        this.tocNav = document.querySelector('.toc_nav');
        this.content = document.querySelector('#content-wrapper');
        
        // Initialize if elements exist
        if (this.tocNav && this.content) {
            this.init();
            this.setupScrollSpy();
        }
    }
    
    init() {
        // Get only h2 headings in the content
        const headings = this.content.querySelectorAll('h2');
        if (!headings.length) return;

        // Store original TOC structure
        const originalLink = this.tocNav.querySelector('.toc_link');
        if (!originalLink) return;
        
        // Clear existing TOC content but maintain structure
        this.tocNav.innerHTML = '';
        
        headings.forEach(heading => {
            // Clone original link structure
            const link = originalLink.cloneNode(true);
            
            // Generate or get heading ID
            if (!heading.id) {
                heading.id = this.generateId(heading.textContent);
            }
            
            // Set link attributes
            link.href = `#${heading.id}`;
            
            // Check for custom title syntax [toc=Custom Title]
            const tocTitle = this.getTocTitle(heading);
            link.textContent = tocTitle;
            
            // Add smooth scroll behavior
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPosition = heading.getBoundingClientRect().top + window.pageYOffset - 60;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                history.pushState(null, null, `#${heading.id}`);
            });
            
            // Add to TOC
            this.tocNav.appendChild(link);
        });
    }
    
    setupScrollSpy() {
        const options = {
            rootMargin: '-20% 0px -80% 0px',
            threshold: 0
        };
        
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const link = this.tocNav.querySelector(`[href="#${entry.target.id}"]`);
                if (link) {
                    if (entry.isIntersecting) {
                        // Remove active class from all links
                        this.tocNav.querySelectorAll('.toc_link').forEach(l => {
                            l.classList.remove('w--current');
                        });
                        // Add active class to current link
                        link.classList.add('w--current');
                    }
                }
            });
        }, options);
        
        // Observe only h2 headings
        this.content.querySelectorAll('h2').forEach(heading => {
            observer.observe(heading);
        });
    }
    
    getTocTitle(heading) {
        const text = heading.textContent;
        const match = text.match(/\[toc=(.*?)\]/);
        
        if (match) {
            heading.textContent = text.replace(/\[toc=.*?\]\s*/, '').trim();
            return match[1].trim();
        }
        
        return text.trim();
    }
    
    generateId(text) {
        return text
            .toLowerCase()
            .replace(/\[toc=.*?\]/g, '')
            .replace(/\s+/g, '-')
            .replace(/[^\w-]/g, '')
            .replace(/--+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
}

// Initialize after page load
window.addEventListener('load', () => {
    window.webflowTOC = new TOC();
});
</script>
