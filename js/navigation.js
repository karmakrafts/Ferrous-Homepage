/**
 * @author Alexander Hinze
 * @since 24/11/2023
 */

function init_nav() {
    const scrollContainer = document.getElementById('scrollContainer')
    const backToTopButton = document.getElementById('backToTopButton')
    scrollContainer.addEventListener('scroll', () => {
        if (scrollContainer.scrollTop > 0) {
            backToTopButton.classList.remove('invisible')
        } else {
            backToTopButton.classList.add('invisible')
        }
    });
    // Also handle window-level scrolling caused by UI elements
    window.addEventListener('scroll', () => {
        if (window.scrollTop > 0) {
            backToTopButton.classList.remove('invisible')
        } else {
            backToTopButton.classList.add('invisible')
        }
    });
}