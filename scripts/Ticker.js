class Ticker {
    selectors = {
        root: '[data-js-ticker]',
        wrapper: '[data-js-ticker-wrapper]',
        item: '[data-js-ticker-item]'
    }

    stateClasses = {
        isAnimating: 'is-animating'
    }

    constructor() {
        this.tickers = document.querySelectorAll(this.selectors.root)
        if (!this.tickers.length) return
        
        this.instances = []
        this.initAll()
    }

    initAll() {
        this.tickers.forEach((tickerElement, index) => {
            if (document.readyState === 'complete') {
                this.initTicker(tickerElement, index)
            } else {
                window.addEventListener('load', () => {
                    this.initTicker(tickerElement, index)
                })
            }
        })
    }

    initTicker(tickerElement, index) {
        const wrapperElement = tickerElement.querySelector(this.selectors.wrapper)
        const itemElements = tickerElement.querySelectorAll(this.selectors.item)
        
        if (!wrapperElement || !itemElements.length) return

        const instance = {
            element: tickerElement,
            wrapper: wrapperElement,
            items: itemElements,
            index: index
        }
        
        this.instances.push(instance)
        
        this.setupAnimation(instance)
        this.bindEvents(instance)
    }

    setupAnimation(instance) {
        this.duplicateContent(instance)
        
        this.startAnimation(instance)
    }

    duplicateContent(instance) {
        instance.items.forEach(item => {
            const clone = item.cloneNode(true)
            instance.wrapper.appendChild(clone)
        })
    }

    startAnimation(instance) {
        instance.wrapper.style.animation = 'ticker-animation 20s linear infinite'
        instance.element.classList.add(this.stateClasses.isAnimating)
    }

    pauseAnimation(instance) {
        instance.wrapper.style.animationPlayState = 'paused'
    }

    resumeAnimation(instance) {
        instance.wrapper.style.animationPlayState = 'running'
    }

    bindEvents(instance) {
        instance.element.addEventListener('mouseenter', () => {
            this.pauseAnimation(instance)
        })

        instance.element.addEventListener('mouseleave', () => {
            this.resumeAnimation(instance)
        })

        instance.element.addEventListener('focusin', () => {
            this.pauseAnimation(instance)
        })

        instance.element.addEventListener('focusout', () => {
            this.resumeAnimation(instance)
        })
    }

    updateAll() {
        this.instances.forEach(instance => {
            this.update(instance)
        })
    }

    update(instance) {
        const wasPaused = instance.wrapper.style.animationPlayState === 'paused'
        
        instance.wrapper.style.animation = 'none'
        
        requestAnimationFrame(() => {
            this.removeDuplicates(instance)
            
            this.duplicateContent(instance)
            
            this.startAnimation(instance)
            
            if (wasPaused) {
                this.pauseAnimation(instance)
            }
        })
    }

    removeDuplicates(instance) {
        const allItems = instance.wrapper.querySelectorAll(this.selectors.item)
        const originalCount = instance.items.length
        
        if (allItems.length > originalCount) {
            for (let i = originalCount; i < allItems.length; i++) {
                allItems[i].remove()
            }
        }
    }

    pauseAll() {
        this.instances.forEach(instance => {
            this.pauseAnimation(instance)
        })
    }

    resumeAll() {
        this.instances.forEach(instance => {
            this.resumeAnimation(instance)
        })
    }

    destroy() {
        this.instances.forEach(instance => {
            instance.element.removeEventListener('mouseenter', () => this.pauseAnimation(instance))
            instance.element.removeEventListener('mouseleave', () => this.resumeAnimation(instance))
            instance.element.removeEventListener('focusin', () => this.pauseAnimation(instance))
            instance.element.removeEventListener('focusout', () => this.resumeAnimation(instance))
        })
        
        window.removeEventListener('resize', this.handleResize)
    }
}

export default Ticker