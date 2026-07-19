// const KEY = '528dc943d2c749317cd4c05633e7940f'

const global = {
    currentPage: window.location.pathname
}

//Highlight Active Link
function highlightActiveLink() {
    const links = document.querySelectorAll('.nav-link')

    links.forEach(link => {
        if (link.getAttribute('href') === global.currentPage) {
            link.classList.add('active')
        }
    })

}
// Init App
function init() {
    switch (global.currentPage) {
        case '/':
        case '/index.html':
            console.log('home')
            break
        case '/shows.html':
            console.log('show')
            break
        case '/movie-details.html':
            console.log('Movie details')
            break
        case '/tv-details.html':
            console.log('Tv details')
            break
        case '/search.html':
            console.log('Search')
            break
    }

    highlightActiveLink()
}

document.addEventListener('DOMContentLoaded', init)