const films = document.getElementById('films');

function filmLayout(title, episode, crawl) {
    let section = document.createElement('section');
    section.classList.add('section');
    section.innerHTML = `
        <div class="container">
        <h1 class="title">${title}</h1>
        <h2 class="subtitle">Episode: ${episode}</h2>
        <p>${crawl}</p>
        <button class="button is-primary is-outlined is-loading">Characters:</button>
        </div>`
    return section;
}

function charLayout(chararr) {
    let characters = document.createElement('p');
    characters.innerHTML = `${chararr.join(', ')}`
    return characters;
}

axios.get('https://swapi.co/api/films/')
    .then(res => {
        let {results} = res.data;
        results.forEach(el => {
            let film = filmLayout(el.title, el.episode_id, el.opening_crawl);
            let promiseChars = el.characters.map(char => axios.get(char).then(ch => ch.data.name));
            Promise.all(promiseChars)
                .then(val => {
                    film.getElementsByTagName('div')[0].appendChild(charLayout(val));
                    film.getElementsByClassName('is-loading')[0].classList.remove('is-loading');
            })
            films.appendChild(film);
        })
    });