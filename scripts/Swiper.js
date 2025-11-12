class Slider {
    selectors = {
        root: '[data-js-slider]',
        prevButton: '[data-js-prev-button]',
        nextButton: '[data-js-next-button]',
    }

    constructor() {
        this.rootElement = document.querySelector(this.selectors.root)
        this.prevButtonElement = document.querySelector(this.selectors.prevButton)
        this.nextButtonElement = document.querySelector(this.selectors.nextButton)
        
        if (this.rootElement) {
            this.initSwiper()
        }
    }

    initSwiper() {
        this.swiper = new Swiper(this.rootElement, {
            loop: true,
            slidesPerView: 1.3,
            spaceBetween: 0,
            navigation: {
                nextEl: this.nextButtonElement,
                prevEl: this.prevButtonElement,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 0,
                },
                1024: {
                    slidesPerView: 2.5,
                    spaceBetween: 0,
                },
                1440: {
                    slidesPerView: 3.5,
                    spaceBetween: 0,
                }
            },
            watchOverflow: true,
            resistance: true,
            resistanceRatio: 0,
            on: {
                init: (swiper) => {
                    this.updateButtonColors(swiper);
                },
                slideChange: (swiper) => {
                    this.updateButtonColors(swiper);
                },
                reachEnd: (swiper) => {
                    this.updateButtonColors(swiper);
                },
                reachBeginning: (swiper) => {
                    this.updateButtonColors(swiper);
                },
            },
        })
    }

    updateButtonColors(swiper = this.swiper) {
        if (!swiper) return;
        
        const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim();
        const defaultColor = getComputedStyle(document.documentElement).getPropertyValue('--color-black').trim();
        
        if (swiper.isBeginning) {
            this.setButtonColor(this.prevButtonElement, defaultColor);
            this.setButtonColor(this.nextButtonElement, accentColor);
        } else {
            this.setButtonColor(this.prevButtonElement, accentColor);
            this.setButtonColor(this.nextButtonElement, accentColor);
        }
    }

    setButtonColor(button, color) {
        if (!button) return;
        
        const paths = button.querySelectorAll('path');
        paths.forEach(path => {
            path.style.stroke = color;
        });
    }
}

export default Slider;