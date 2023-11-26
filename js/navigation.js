/**
 * @author Alexander Hinze
 * @since 24/11/2023
 */

function init() {
    const scrollContainer = document.getElementById('scrollContainer')
    const backToTopButton = document.getElementById('backToTopButton')
    scrollContainer.addEventListener('scroll', () => {
        if (scrollContainer.scrollTop > (window.innerHeight / 3)) {
            backToTopButton.classList.remove('invisible')
        } else {
            backToTopButton.classList.add('invisible')
        }
    });
    // Also handle window-level scrolling caused by UI elements
    window.addEventListener('scroll', () => {
        if (window.scrollTop > (window.innerHeight / 3)) {
            backToTopButton.classList.remove('invisible')
        } else {
            backToTopButton.classList.add('invisible')
        }
    });
}

init()