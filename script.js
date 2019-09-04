const films = document.getElementById('films');

function filmLayout(title, episode, crawl) {
    let section = document.createElement('section');
    section.classList.add('section');
    section.innerHTML = `
        <div class="container">
        <h1 class="title">${title}</h1>
        <h2 class="subtitle">Episode: ${episode}</h2>
        <p>${crawl}</p>
        </div>`
    return section;
}

function charLayout(chararr) {
    let characters = document.createElement('p');
    characters.innerHTML = `
        <strong>Characters:</strong> ${chararr.join(', ')}`
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

let chars;

getXHJSON('https://swapi.co/api/films/').then(res => {
    let {results} = res;
    console.log(results);
    results.forEach(el => {
        let film = filmLayout(el.title, el.episode_id, el.opening_crawl);
        chars = el.characters;
        let promiseChars = [];
        el.characters.forEach(char => promiseChars.push(getXHJSON(char)));
        Promise.all(promiseChars).then(val => {
            let filmChars = []
            val.forEach(v => filmChars.push(v.name));
            film.getElementsByTagName('div')[0].appendChild(charLayout(filmChars));
        })
        films.appendChild(film);
    })
});