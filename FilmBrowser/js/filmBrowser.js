function fetchRequest(url) {
  return fetch(url)
    .then(body => body.json())
}

class Film {
  constructor(id, title, type, poster, year) {
    this._id = id;
    this._title = title;
    this.poster = poster;
    this._type = type;
    this._year = year;
    this._detail = { time: '', genre: '', director: '', actors: '', plot: '', language: '' }
  }
  get id() { return this._id; }

  get title() { return this._title; }

  get type() { return this._type; }

  get poster() { return this._poster; }
  set poster(value) { value !== 'N/A' ? this._poster = value : this.poster = 'images/No_image_available.svg'; }

  get year() { return this._year; }

  get detail() { return this._detail; }

}

class FilmRepository {
  constructor() {
    this._films = [];
  }

  get films() { return this._films; }

  addFilms(arrFilms) {
    this._films = arrFilms.map(obj => new Film(obj.imdbID, obj.Title, obj.Type, obj.Poster, obj.Year));
  }

  addDetail(id, objDetail) {
    const film = this.getFilmById(id);
    film.detail.time = objDetail.Runtime;
    film.detail.genre = objDetail.Genre;
    film.detail.director = objDetail.Director;
    film.detail.actors = objDetail.Actors;
    film.detail.plot = objDetail.Plot;
    film.detail.language = objDetail.Language;
  }
  getFilmById(id) {
    return this._films.find((f) => f.id === id);
  }
}

class FilmBrowserApp {
  constructor() {
    this._filmRepository = new FilmRepository();
  }


  searchFilms(searchText) {
    if (searchText !== '' && /([^\s])/.test(searchText)) {
      fetchRequest(`http://www.omdbapi.com/?s=${searchText}&apikey=57927523`)
        .then(resultValue => {
          if (resultValue.Response === 'True') {
            this._filmRepository.addFilms(resultValue.Search);
            this.showFilms();
          }
          else {
            this.showMessage('No films found for this search!!');
          }
        })
        .catch(rejectValue => { this.showMessage(`Something went wrong retrieving the film data: ${rejectValue}`); });
    }
    else {
      this.showMessage('The search can not be empty!!');
    }
  }

  getFilm(id) {
    fetchRequest(`http://www.omdbapi.com/?i=${id}&plot=full&apikey=57927523`)
      .then(resultValue => {
        if (resultValue.Response === 'True') {
          this._filmRepository.addDetail(id, resultValue);
          const film = this._filmRepository.getFilmById(id);
          this.showDetailFilm(film);
        }
      })
      .catch(rejectValue => {
        this.showMessage(`Something went wrong retrieving the film detail data: ${rejectValue}`);
      });
  }


  showFilms() {
    document.getElementById('films').innerHTML = '';
    this._filmRepository.films.forEach((film) => {
      document.getElementById('films').insertAdjacentHTML('beforeend',
        `     
        <div class="col s12 m6">
          <div class="card small horizontal">
            <div class="card-image">
              <img id="${film.id}" src="${film.poster}">
              </div>
            <div class="card-stacked">  
              <div class="card-content">
                <span class="card-title">${film.title}</span>             
                <ul>
                  <li>Type: ${film.type}</li>
                  <li>Year: ${film.year}</li>
                </ul>
             </div> 
            </div>       
          </div>
        </div>
      `
      );
      document.getElementById(film.id).onclick = () => {
        this.getFilm(film.id);
      }
    });
  }

  showDetailFilm(film) {
    let details = '';
    Object.entries(film.detail).forEach(([key, value]) => {
      details += `<li><label>${key}:</label> ${value}</li>`;
    });
    document.getElementById('films').innerHTML = '';
    document.getElementById('films').insertAdjacentHTML('beforeend',
      `     
        <div class="col s12">
          <div class="card horizontal">
            <div class="card-image">
              <img id="listFilms" src="${film.poster}">
            </div>
            <div class="card-stacked">  
              <div class="card-content">
                <span class="card-title">${film.title}</span>             
                <ul>
                  <li><label>type:</label> ${film.type}</li>
                  <li><label>year:</label> ${film.year}</li>
                  ${details}
                </ul>
              </div>
            </div>       
          </div>
        </div>
      `
    );
    document.getElementById('listFilms').onclick = () => { this.showFilms(); }
  }

  showMessage(message) {
    document.getElementById('films').innerHTML = '';
    document.getElementById('films').insertAdjacentHTML('beforeend',
      `
      <div class="col s12">
        <p>${message}</p>
      </div>
      `
    );
  }
}

const init = function () {
  const filmBrowserApp = new FilmBrowserApp();
  document.getElementById("searchBtn").onclick = () => {
    filmBrowserApp.searchFilms(document.getElementById('searchText').value)
  }
}

window.onload = init;
