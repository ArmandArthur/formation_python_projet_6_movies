window.addEventListener("DOMContentLoaded", (event) => {
    main()
});

const create_img = function(url, id) {
    return `<img src="${url}" alt="" onclick="show_movie_info(${id})">`
}

let load_category = async function(cat_name = '') {
    const url = `http://127.0.0.1:8000/api/v1/titles/?genre_contains=${cat_name}&page_size=7&sort_by=-imdb_score`
    let response = await fetch(url)
    let json_resp = await response.json()
    let movies = json_resp.results
    return movies
}

let main = async function() {

    let carousel_best = await create_carousel()
    let best_container = document.querySelector('.best')
    best_container.innerHTML = carousel_best
    await carousel_nav('.best')

    let carousel_family = await create_carousel('family')
    let family_container = document.querySelector('.family')
    family_container.innerHTML = carousel_family
    await carousel_nav('.family')

    let carousel_crime = await create_carousel('crime')
    let crime_container = document.querySelector('.crime')
    crime_container.innerHTML = carousel_crime
    await carousel_nav('.crime')

    let carousel_adventure = await create_carousel('adventure')
    let adventure_container = document.querySelector('.adventure')
    adventure_container.innerHTML = carousel_adventure
    await carousel_nav('.adventure')


}

let create_carousel = async function(cat_name) {
    const movies = await load_category(cat_name)
    let imgs = ''
    for (let index = 0; index < 7; index++) {
        imgs += create_img(movies[index].image_url, movies[index].id)
    }
    // Create span tmp
    var el = document.createElement('span');

    // Get content of template
    var template = document.getElementById("carousel-template").innerHTML

    // Set content of span tmp
    el.innerHTML = template

    // Remplace variables
    el.getElementsByClassName('carousel-list')[0].innerHTML = imgs

    // Return content of span tmp
    return el.innerHTML
}


let carousel_nav = async function(selector) {
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