class Header {
    selectors = {
        root: '[data-js-header]',
        overlay: '[data-js-header-overlay]',
        burgerButton: '[data-js-header-burger-button]',
        hasChildren: '[data-js-header-has-children]',
        submenu: '[data-js-header-submenu]',
    }

    stateClasses = {
        isActive: 'is-active',
        isLock: 'is-lock',
        isOpen: 'is-open',
    }

    constructor() {
        this.rootElement = document.querySelector(this.selectors.root)
        this.overlayElement = this.rootElement.querySelector(this.selectors.overlay)
        this.burgerButtonElement = this.rootElement.querySelector(this.selectors.burgerButton)
        this.hasChildrenElements = this.rootElement.querySelectorAll(this.selectors.hasChildren)
        this.isMobile = window.innerWidth < 768
        this.bindEvents()
        this.handleResize()
    }

    handleResize = () => {
        this.isMobile = window.innerWidth < 768
    }

    closeMenu = () => {
        this.burgerButtonElement.classList.remove(this.stateClasses.isActive)
        this.overlayElement.classList.remove(this.stateClasses.isActive)
        document.documentElement.classList.remove(this.stateClasses.isLock)
        
        this.hasChildrenElements.forEach(element => {
            const submenu = element.querySelector(this.selectors.submenu)
            submenu.classList.remove(this.stateClasses.isOpen)
        })
    }

    onBurgerButtonClick = () => {
        this.burgerButtonElement.classList.toggle(this.stateClasses.isActive)
        this.overlayElement.classList.toggle(this.stateClasses.isActive)
        document.documentElement.classList.toggle(this.stateClasses.isLock)
    }

    onHasChildrenMouseEnter = (event) => {
        const submenu = event.target.closest('.header__menu-item').querySelector(this.selectors.submenu)
        submenu.classList.add(this.stateClasses.isOpen)
    }

    onHasChildrenMouseLeave = (event) => {
        const submenu = event.target.closest('.header__menu-item').querySelector(this.selectors.submenu)
        submenu.classList.remove(this.stateClasses.isOpen)
    }

    onHasChildrenClick = (event) => {
        if (event.target.tagName === 'A' && event.target.getAttribute('href') !== '#') {
            return
        }

        event.preventDefault()
        
        const menuItem = event.target.closest('.header__menu-item')
        const submenu = menuItem.querySelector(this.selectors.submenu)
        
        this.hasChildrenElements.forEach(element => {
            if (element !== menuItem) {
                const otherSubmenu = element.querySelector(this.selectors.submenu)
                otherSubmenu.classList.remove(this.stateClasses.isOpen)
            }
        })
        
        submenu.classList.toggle(this.stateClasses.isOpen)
    }

    onMenuLinkClick = (event) => {
        const link = event.target.closest('a')
        const href = link.getAttribute('href')
        
        if (href && href.startsWith('#')) {
            if (this.isMobile) {
                this.closeMenu()
            }
            
            const parentMenuItem = link.closest('.header__menu-item')
            if (parentMenuItem && parentMenuItem.classList.contains('has-children')) {
                const submenu = parentMenuItem.querySelector(this.selectors.submenu)
                submenu.classList.remove(this.stateClasses.isOpen)
            }
        }
        
        if (this.isMobile && href && !href.startsWith('#') && !href.startsWith('javascript')) {
            this.closeMenu()
        }
    }

    bindEvents() {
        this.burgerButtonElement.addEventListener('click', this.onBurgerButtonClick)

        this.hasChildrenElements.forEach(element => {
                element.addEventListener('mouseenter', this.onHasChildrenMouseEnter)
                element.addEventListener('mouseleave', this.onHasChildrenMouseLeave)
                element.addEventListener('click', this.onHasChildrenClick)
        })

        const allMenuLinks = this.rootElement.querySelectorAll('.header__menu-link, .header__submenu-link')
        allMenuLinks.forEach(link => {
            link.addEventListener('click', this.onMenuLinkClick)
        })

        window.addEventListener('resize', this.handleResize)
    }
}

export default Header