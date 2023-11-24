/**
 * @author Alexander Hinze
 * @since 22/11/2023
 */

let wasScrolledBefore = false

function init() {
    const scrollContainer = document.getElementById('scrollContainer')
    const backgroundContainer = document.getElementById('backgroundContainer')
    let prevScrollTop = 0
    scrollContainer.addEventListener('scroll', () => {
        const scrollTop = scrollContainer.scrollTop
        if (scrollTop > prevScrollTop && scrollTop >= ((window.innerHeight / 3) << 1)) {
            if (wasScrolledBefore) {
                prevScrollTop = scrollTop
                return
            }
            backgroundContainer.classList.add('visible')
            wasScrolledBefore = true
        } else if (scrollTop < prevScrollTop && scrollTop <= window.innerHeight) {
            if (!wasScrolledBefore) {
                prevScrollTop = scrollTop
                return
            }
            backgroundContainer.classList.remove('visible')
            wasScrolledBefore = false
        }
        prevScrollTop = scrollTop
    });
}