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

function getXHJSON(url) {
    return new Promise (function(resolve, reject) {
        let req = new XMLHttpRequest;
        req.open('GET', url);
        req.onload = function() {
            if (req.readyState === XMLHttpRequest.DONE) {
                if (req.status === 200) {
                    resolve(JSON.parse(req.response));
                } else {
                    reject(Error(req.statusText));
                }
            }
        };

        req.onerror = function() {
            reject(Error("Network Error"));
          };
        
        req.send();

    })
}


getXHJSON('https://swapi.co/api/films/')
    .then(res => {
        let {results} = res;
        results.forEach(el => {
            let film = filmLayout(el.title, el.episode_id, el.opening_crawl);
            let promiseChars = el.characters.map(char => getXHJSON(char));
            Promise.all(promiseChars)
                .then(val => {
                    let filmChars = val.map(v => v.name);
                    film.getElementsByTagName('div')[0].appendChild(charLayout(filmChars));
                    film.getElementsByClassName('is-loading')[0].classList.remove('is-loading');
            })
            films.appendChild(film);
    })
});