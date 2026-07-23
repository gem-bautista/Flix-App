const global = {
    currentPage: window.location.pathname,
    search: {
        term: '',
        type: '',
        page: 1,
        totalPages: 1
    },
    api: {
        apiKey: '528dc943d2c749317cd4c05633e7940f',
        apiUrl: 'https://api.themoviedb.org/3/'
    }
}

//Fetch data from TMDB API
async function fetchAPIData(endpoint) {
    const API_KEY = global.api.apiKey
    const API_URL = global.api.apiUrl

    showSpinner()

    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`)
    const data = await response.json()
    hideSpinner()
    return data
}

//Make request to search
async function searchAPIData() {
    const API_KEY = global.api.apiKey
    const API_URL = global.api.apiUrl

    showSpinner()

    const response = await fetch(`${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}`)
    const data = await response.json()
    
    hideSpinner()
    return data
}

//Search Movies and Show
async function search() {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    global.search.type = urlParams.get('type')
    global.search.term = urlParams.get('search-term')

    console.log(global.search.type)
    if (global.search.term !== '' && global.search.term !== null) {
        const results = await searchAPIData()
        console.log(results)
    } else {
        showAlert('Please enter a search term')
    }
}


async function displayPopularMovies() {
    const { results } = await fetchAPIData('movie/popular')

    results.forEach(movie => {
        const div = document.createElement('div')
        div.classList.add('card')
        div.innerHTML = ` 
        <a href="movie-details.html?id=${movie.id}">
          ${movie.poster_path ?
                `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="Movie Title" />`
                :
                `<img src="images/no-image.jpg" class="card-img-top" alt="Movie Title" />`
            }
        </a>
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-text">
            <small class="text-muted">${movie.release_date}</small>
          </p>
        </div>`

        document.querySelector('#popular-movies').appendChild(div)
    })
}

async function displayPopularShows() {

    const { results } = await fetchAPIData('tv/popular')


    results.forEach(show => {
        const div = document.createElement('div')
        div.classList.add('card')
        div.innerHTML = `
        <a href="tv-details.html?id=${show.id}">
        ${show.poster_path ?
                `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" class="card-img-top" alt="Show Title" />` :
                `<img src="images/no-image.jpg" class="card-img-top" alt="Show Title"
                />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Aired: ${show.first_air_date}</small>
            </p>
          </div>`

        document.querySelector('#popular-shows').appendChild(div)
    })

    console.log(results)
}

// fetch the specific movie when clicking the image.
async function displayMovieDetails() {
    const movieId = window.location.search.split('=')[1]
    //the movie here is an object
    const movie = await fetchAPIData(`movie/${movieId}`)
    //Overlay for background image
    console.log(movie)
    displayBackgroundImage('movie', movie.backdrop_path)
    const div = document.createElement('div')
    div.innerHTML = `
     <div class="details-top">
          <div>
          ${movie.poster_path ? `<img
            src='https://image.tmdb.org/t/p/w500${movie.poster_path}'
            class="card-img-top"
            alt="Movie Title"
        />` : `<img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="Movie Title"
        />`
        }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
                ${movie.genres.map(genre => {
            return `<li>${genre.name}</li>`
        }).join('')}
            </ul>
            <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(movie.budget)}</li>
            <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(movie.revenue)}</li>
            <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
          ${movie.production_companies.map((company) => `<span>${company.name}</span>`).join(', ')}
          </div>
        </div>
    `
    const parentDiv = document.getElementById('movie-details')
    parentDiv.appendChild(div)
}

async function displayShowDetails() {
    const showId = window.location.search.split('=')[1]
    //the show here is an object
    console.log(showId)
    const show = await fetchAPIData(`tv/${showId}`)
    //Overlay for background image
    console.log(show)
    displayBackgroundImage('show', show.backdrop_path)
    const div = document.createElement('div')
    div.innerHTML = `
     <div class="details-top">
          <div>
          ${show.poster_path ? `<img
            src='https://image.tmdb.org/t/p/w500${show.poster_path}'
            class="card-img-top"
            alt="Show Title"
        />` : `<img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="Show Title"
        />`
        }
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${show.first_air_date}</p>
            <p>
              ${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
                ${show.genres.map(genre => {
            return `<li>${genre.name}</li>`
        }).join('')}
            </ul>
            <a href="${show.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number of Episodes:</span> ${show.number_of_episodes}</li>
            <li><span class="text-secondary">Last Episode to Air:</span>  ${show.last_episode_to_air.name}</li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
          ${show.production_companies.map((company) => `<span>${company.name}</span>`).join(', ')}
          </div>
        </div>
    `
    const parentDiv = document.getElementById('show-details')
    parentDiv.appendChild(div)
}

// Display backdrop on details pages
function displayBackgroundImage(type, backgroundPath) {
    const overlayDIV = document.createElement('div')
    overlayDIV.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`
    overlayDIV.style.backgroundSize = 'cover'
    overlayDIV.style.backgroundPosition = 'center'
    overlayDIV.style.backgroundRepeat = 'no-repeat'
    overlayDIV.style.height = '100vh'
    overlayDIV.style.width = '100vw'
    overlayDIV.style.position = 'absolute'
    overlayDIV.style.top = '0'
    overlayDIV.style.left = '0'
    overlayDIV.style.zIndex = '-1'
    overlayDIV.style.opacity = '0.1'

    if (type == 'movie') {
        document.querySelector('#movie-details').appendChild(overlayDIV)
    } else {
        document.querySelector('#show-details').appendChild(overlayDIV)
    }

}

async function displaySlider() {
    const { results } = await fetchAPIData('movie/now_playing')

    results.forEach(movie => {
        const div = document.createElement('div')
        div.classList.add('swiper-slide')

        div.innerHTML = `       
            <a href="movie-details.html?id=${movie.id}">
            ${movie.poster_path ?
                `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />` :
                `<img src="./images/no-image.jpg" alt="Movie Title" />`
            }
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)}
            </h4>`

        document.querySelector('.swiper-wrapper').appendChild(div)
    })

    initSwiper()
}

function initSwiper() {
    const swiper = new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        freeMode: true,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false
        },
        breakpoints: {
            500: {
                slidesPerView: 2
            },
            700: {
                slidesPerView: 3
            },
            1200: {
                slidesPerView: 4
            }
        }
    })
}

// Used when loading
function showSpinner() {
    document.querySelector('.spinner').classList.add('show')
}

// Hide after fetch
function hideSpinner() {
    document.querySelector('.spinner').classList.remove('show')
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

// Show Alert
function showAlert(message, className) {
    const alertEl = document.createElement('div')
    alertEl.classList.add('alert', className)
    alertEl.appendChild(document.createTextNode(message))
    document.querySelector('#alert').appendChild(alertEl)

    setTimeout(() => {
        alertEl.remove()
    }, 2000)
}


function addCommasToNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// Init App
function init() {
    switch (global.currentPage) {
        case '/':
        case '/index.html':
            displaySlider()
            displayPopularMovies()
            break
        case '/shows.html':
            displayPopularShows()
            break
        case '/movie-details.html':
            displayMovieDetails()
            break
        case '/tv-details.html':
            displayShowDetails()
            break
        case '/search.html':
            search()
            break
    }

    highlightActiveLink()
}

document.addEventListener('DOMContentLoaded', init)