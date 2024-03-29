const $films = $('#films');

function filmLayout(title, episode, crawl) {
    let $section = $(`
        <section class="section">
            <div class="container">
                <h1 class="title">${title}</h1>
                <h2 class="subtitle">Episode: ${episode}</h2>
                <p>${crawl}</p>
                <button class="button is-primary is-outlined is-loading">Characters:</button>
            </div>
        </section>`);
    return $section;
}

function charLayout(chararr) {
    let $characters = $("</p>");
    $characters.html(`${chararr.join(', ')}`)
    return $characters;
}

$.get('https://swapi.co/api/films/')
    .done(res => {
        let {results} = res;
        results.forEach(el => {
            let $film = filmLayout(el.title, el.episode_id, el.opening_crawl);
            $.when.apply($, el.characters.map(charurl => $.get(charurl)))
                .done(function() {
                    let charArr = [...arguments].map(el => el[0].name);
                    $film.find('div').append(charLayout(charArr));
                    $film.find('.is-loading').removeClass('is-loading');
                })
            $films.append($film);
        })
    });