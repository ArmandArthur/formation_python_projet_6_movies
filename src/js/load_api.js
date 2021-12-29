window.addEventListener("DOMContentLoaded", (event) => {
    main()
    let modal = document.querySelector('#modal')
    let background = document.querySelector('#background')

    document.addEventListener("keydown", function(e) {
        if (e.keyCode == 27) {
            modal.classList.add('hide')
            background.classList.add('hide')
            modal.innerHTML = ''
        }

    })
});

let show_movie_info = async function(id, is_main_picture) {

    let modal = document.querySelector('#modal')
    let background = document.querySelector('#background')
    modal.classList.remove('hide')
    background.classList.remove('hide')
    let modal_data = await load_modal(id)
        // Objet de variables
    const variables = {
        'movie-title': modal_data.title,
        'movie-img': '<img src="' + modal_data.image_url + '" alt="' + modal_data.image_url + '"/>',
        'movie-genres': modal_data.genres.map(el => { return el }),
        'movie-date': modal_data.date_published,
        'movie-rated': modal_data.rated,
        'movie-imdb_score': modal_data.imdb_score,
        'movie-directors': modal_data.directors.map(el => { return el }),
        'movie-actors': modal_data.actors.map(el => { return el }),
        'movie-duration': modal_data.duration,
        'movie-countries': modal_data.countries.map(el => { return el }),
        'movie-boxoffice-usa': modal_data.usa_gross_income,
        'movie-boxoffice-worldwide': modal_data.worldwide_gross_income,
        'movie-description': modal_data.description
    }

    let template = load_template('modal-template', variables)
    modal.innerHTML = modal.innerHTML + template
    modal.querySelector(".close").addEventListener("click", function() {
        modal.classList.add('hide')
        modal.innerHTML = ''
        background.classList.add('hide')
    })

    if (is_main_picture == true) {
        let next_modal = document.querySelector('.next_modal')
        let prev_modal = document.querySelector('.prev_modal')
        next_modal.classList.add('hide')
        prev_modal.classList.add('hide')

    } else {
        modal.querySelector(".next_modal").addEventListener("click", function() {
            var img = document.querySelector('img[id="image_' + id + '"]')
            var next = img.nextSibling
            modal.classList.add('hide')
            background.classList.add('hide')
            modal.innerHTML = ''
            if (next != null) {
                document.querySelector('#' + next.id).click()
            } else {
                img.closest('.carousel-list').firstChild.click()
            }
        })
        modal.querySelector(".prev_modal").addEventListener("click", function() {
            var img = document.querySelector('img[id="image_' + id + '"]')
            var prev = img.previousSibling
            modal.classList.add('hide')
            background.classList.add('hide')
            modal.innerHTML = ''
            if (prev != null) {
                document.querySelector('#' + prev.id).click()
            } else {
                img.closest('.carousel-list').lastChild.click()
            }
        })
    }


}

const create_img = function(url, id, is_main_picture) {
    let id_img = ''
    if (is_main_picture == false)
        id_img = `id="image_${id}"`
    else
        id_img = `id="image_main"`
    return `<img ${id_img} src="${url}" onclick="show_movie_info(${id},${is_main_picture} )"/>`
}

let load_category = async function(cat_name = '') {
    const url = `http://127.0.0.1:8000/api/v1/titles/?genre_contains=${cat_name}&page_size=7&sort_by=-imdb_score`
    let response = await fetch(url)
    let json_resp = await response.json()
    let movies = json_resp.results
    return movies
}
let load_modal = async function(id) {
    let url = `http://127.0.0.1:8000/api/v1/titles/${id}`
    let response = await fetch(url)
    let json_resp = await response.json()
        //let movies = json_resp.results
    return json_resp
}
let load_simple = async function() {

    let url = `http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&page_size=1`
    let response = await fetch(url)
    let json_resp = await response.json()
    let movies = json_resp.results
    return movies[0]
}

let main = async function() {

    let simple = await create_simple()
    let first_container = document.querySelector('.first')
    first_container.innerHTML = create_img(simple.image_url, simple.id, true)


    let carousel_best = await create_carousel()
    let best_container = document.querySelector('.best')
    best_container.innerHTML = carousel_best
    await carousel_arrow('.best')

    let carousel_family = await create_carousel('family')
    let family_container = document.querySelector('.family')
    family_container.innerHTML = carousel_family
    await carousel_arrow('.family')

    let carousel_crime = await create_carousel('crime')
    let crime_container = document.querySelector('.crime')
    crime_container.innerHTML = carousel_crime
    await carousel_arrow('.crime')

    let carousel_adventure = await create_carousel('adventure')
    let adventure_container = document.querySelector('.adventure')
    adventure_container.innerHTML = carousel_adventure
    await carousel_arrow('.adventure')


}

let create_simple = async function() {
    const movie_first = await load_simple()
    return movie_first
}

let create_carousel = async function(cat_name) {
    const movies = await load_category(cat_name)
    let imgs = ''
    for (let index = 0; index < 7; index++) {
        imgs += create_img(movies[index].image_url, movies[index].id, false)
    }

    // Objet de variables
    const variables = {
        'carousel-list': imgs
    };

    return load_template('carousel-template', variables)
}

let load_template = function(id, variables) {
    // Create span tmp
    var el = document.createElement('span');

    // Get content of template
    var template = document.getElementById(id).innerHTML

    // Set content of span tmp
    el.innerHTML = template

    // Remplace variables
    for (const [key, value] of Object.entries(variables)) {
        el.getElementsByClassName(key)[0].innerHTML = value

    }

    // Return content of span tmp
    return el.innerHTML
}
let carousel_arrow = async function(selector) {
    let iteration = 0
    let longeur_carousel = 4
    let container = document.querySelector(selector)
    let prev = container.querySelector('.prev');
    let next = container.querySelector('.next');

    prev.addEventListener('click', function(event) {
        event.preventDefault();
        let caroussel_container = this.closest('.carousel-container')
        var next = caroussel_container.querySelector('.next');
        next.classList.remove('hide')
        let imgs = caroussel_container.querySelectorAll('img');
        let length = imgs.length;
        // Condition de MAJ
        if (iteration > 0) {
            // Cache toutes les images
            for (index = 0; index < length; index++) {
                imgs[index].classList.add('hide')
            }
            // Affiche les bonnes
            iteration--
            for (index = iteration; index < length; index++) {
                imgs[index].classList.remove('hide')
            }
            if (iteration == 0) {
                prev.classList.add('hide')
            }


        }
    })

    next.addEventListener('click', function(event) {
        event.preventDefault();
        let caroussel_container = this.closest('.carousel-container')
        var prev = caroussel_container.querySelector('.prev');
        prev.classList.remove('hide')
        let imgs = caroussel_container.querySelectorAll('img');
        let length = imgs.length;
        iteration++
        // Condition de MAJ
        if (iteration < longeur_carousel) {
            // Cache toutes les images
            for (index = 0; index < length; index++) {
                imgs[index].classList.add('hide')
            }

            // Affiche les bonnes
            for (index = iteration; index < length; index++) {
                imgs[index].classList.remove('hide')
            }
            if (iteration == 3) {
                next.classList.add('hide')
            }


        }
    })

}