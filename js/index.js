/**
 * @author Alexander Hinze
 * @since 22/11/2023
 */

let wasScrolledBefore = false

function init_background() {
    const scrollContainer = document.getElementById('scrollContainer')
    if(scrollContainer === null) {
        return
    }
    const backgroundContainer = document.getElementById('backgroundContainer')
    if(backgroundContainer === null) {
        return
    }
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

function init_line_points() {
    const scrollContainer = document.getElementById('scrollContainer')
    if(scrollContainer === null) {
        console.error('Could not retrieve container element')
        return
    }
    const line = document.getElementById('line')
    if(line === null) {
        console.error('Could not retrieve line element')
        return
    }
    const icons = document.getElementsByClassName('linePoint')
    if(icons === null) {
        console.error('Could not retrieve line icon set')
        return
    }
    scrollContainer.addEventListener('scroll', () => {
        if(scrollContainer.scrollTop > ((window.innerHeight / 3) << 1)) {
            for(let icon of icons) {
                icon.classList.add('scaled')
            }
            line.classList.add('expanded')
        }
        else {
            for(let icon of icons) {
                icon.classList.remove('scaled')
            }
            line.classList.remove('expanded')
        }
    })
}

function init() {
    init_background()
    init_line_points()
}

init()