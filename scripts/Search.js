export default class Search {
    constructor() {
        this.selectors = {
            searchInput: '[data-js-search-input]',
            searchContainer: '[data-js-search-container]',
            searchItem: '[data-js-search-item]',
            searchField: '[data-js-search-field]',
            tabsContent: '[data-js-tabs-content]'
        }

        this.searchInput = document.querySelector(this.selectors.searchInput);
        this.searchTimeout = null;
        this.debounceDelay = 300;

        this.init();
    }

    init() {
        if (!this.searchInput) {
            console.warn('Search input not found');
            return;
        }

        this.bindEvents();
    }

    bindEvents() {
        // Обработчик ввода с debounce
        this.searchInput.addEventListener('input', () => {
            this.handleSearchInput();
        });

        // Обработчик Enter
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleEnterPress();
            }
        });
    }

    handleSearchInput() {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.performSearch();
        }, this.debounceDelay);
    }

    handleEnterPress() {
        clearTimeout(this.searchTimeout);
        this.performSearch();
    }

    getActiveSearchContainer() {
        const activeTabContent = document.querySelector(`${this.selectors.tabsContent}.is-active`);
        return activeTabContent ? activeTabContent.querySelector(this.selectors.searchContainer) : null;
    }

    performSearch() {
        const searchTerm = this.searchInput.value.trim().toLowerCase();
        const searchContainer = this.getActiveSearchContainer();
        
        if (!searchContainer) {
            console.warn('Active search container not found');
            return;
        }

        const searchItems = searchContainer.querySelectorAll(this.selectors.searchItem);
        let hasVisibleResults = false;

        searchItems.forEach(item => {
            const isVisible = this.isItemMatchingSearch(item, searchTerm);
            
            if (isVisible) {
                item.style.display = '';
                hasVisibleResults = true;
            } else {
                item.style.display = 'none';
            }
        });

        this.showNoResultsMessage(searchContainer, !hasVisibleResults && searchTerm !== '');
    }

    isItemMatchingSearch(item, searchTerm) {
        if (searchTerm === '') return true;

        const searchFields = item.querySelectorAll(this.selectors.searchField);
        let searchContent = '';

        searchFields.forEach(field => {
            searchContent += field.textContent.toLowerCase() + ' ';
        });

        return searchContent.includes(searchTerm);
    }

    showNoResultsMessage(container, show) {
        let noResultsMsg = container.querySelector('[data-js-search-no-results]');
        
        if (show && !noResultsMsg) {
            noResultsMsg = document.createElement('li');
            noResultsMsg.className = 'articles__body-item is-full';
            noResultsMsg.setAttribute('data-js-search-no-results', '');
            noResultsMsg.innerHTML = `
                <div class="article-card" style="text-align: center; padding: 2rem;">
                    <p style="color: #666; font-size: 1.1rem;">No articles found matching your search.</p>
                    <p style="color: #999; margin-top: 0.5rem;">Try different keywords or check the spelling.</p>
                </div>
            `;
            container.appendChild(noResultsMsg);
        } else if (!show && noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    updateSearch() {
        this.performSearch();
    }

    clearSearch() {
        this.searchInput.value = '';
        this.performSearch();
    }

    search(term) {
        this.searchInput.value = term;
        this.performSearch();
    }

    destroy() {
        clearTimeout(this.searchTimeout);
        if (this.searchInput) {
            this.searchInput.removeEventListener('input', this.handleSearchInput);
            this.searchInput.removeEventListener('keypress', this.handleEnterPress);
        }
    }
}