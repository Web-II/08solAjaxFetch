function fetchRequest(url){
	return fetch(url)
  		.then(body => body.json()) 
}

class Film {
  constructor(id, title, type, poster, year) {
    this.id = id;
    this.title = title;
    this.poster = poster;
    this.type = type;
    this.year = year;
    this.detail = {time:'',genre:'',director:'',actors:'',plot:'',language:''}
  }
  get id() { return this._id; }
  set id(value) { this._id = value; }

  get title() { return this._title; }
  set title(value) { this._title = value; }

  get type() { return this._type; }
  set type(value) { this._type = value; }

  get poster() { return this._poster; }
  set poster(value) { value !== 'N/A' ? this._poster = value : this.poster = 'images/No_image_available.svg'; }
 
  get year() { return this._year; }
  set year(value) { this._year = value; }

  get detail() { return this._detail; }
  set detail(value) { this._detail = value; }


}

class FilmRepository {
  constructor() {
    this.films = [];
  }

  get films() { return this._films; }
  set films(value) { this._films = value; }

  addFilms(arrFilms) {
    this.films = arrFilms.map(obj=>new Film(obj.imdbID, obj.Title, obj.Type, obj.Poster, obj.Year));
  }
  addDetail(id,objDetail){
    const film = this.getFilmById(id);
    film.detail.time = objDetail.Runtime;
    film.detail.genre = objDetail.Genre;
    film.detail.director = objDetail.Director;
    film.detail.actors = objDetail.Actors;
    film.detail.plot = objDetail.Plot;
    film.detail.language = objDetail.Language;
  }
  getFilmById(id){
    return this.films.find((f)=>f.id === id);
  }
}

class FilmBrowserApp {
  constructor() {
    this.filmRepository = new FilmRepository();
  }

  get filmRepository() { return this._filmRepository; }
  set filmRepository(value) { this._filmRepository = value; }

  searchFilms(searchText){
      if (searchText !== '' && /([^\s])/.test(searchText)){
        fetchRequest(`http://www.omdbapi.com/?s=${searchText}&apikey=57927523`)
        .then(resultValue => {
          if (resultValue.Response === 'True'){
			        this.filmRepository.addFilms(resultValue.Search);
			        this.showFilms();
          }
		    })
		    .catch(rejectValue => { console.log(rejectValue); });
      }
  }

  getFilm(id){
    fetchRequest(`http://www.omdbapi.com/?i=${id}&plot=full&apikey=57927523`)
        .then(resultValue => {
          //console.log(resultValue);
          if (resultValue.Response === 'True'){
              this.filmRepository.addDetail(id,resultValue);
              const film = this.filmRepository.getFilmById(id);
			        //this.filmRepository.addFilms(resultValue.Search);
              //console.log(this.filmRepository.films)
			        this.showDetailFilm(film);
          }
		    })
		    .catch(rejectValue => { console.log(rejectValue); });
  }
  

  showFilms() {
    document.getElementById('films').innerHTML = '';
    this.filmRepository.films.forEach((film) => {
      document.getElementById('films').insertAdjacentHTML('beforeend',
      `     
        <div class="col s12 m6">
          <div class="card small horizontal">
            <div class="card-image">
              <img src="${film.poster}">
              </div>
            <div class="card-stacked">  
              <div class="card-content">
                <span class="card-title">${film.title}</span>             
                <ul>
                  <li>Type: ${film.type}</li>
                  <li>Year: ${film.year}</li>
                </ul>
                <a id="${film.id}" class="btn-floating btn-small waves-effect waves-light green"><i class="material-icons">details</i></a>
              </div> 
            </div>       
          </div>
        </div>
      `
      );
      document.getElementById(film.id).onclick = ()=>{
        this.getFilm(film.id);
      }
    });
  }

  showDetailFilm(film){
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
              <img src="${film.poster}">
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
          <a id="listFilms" class="waves-effect waves-light btn-small"><i class="material-icons right">list</i>Back</a>            
        </div>
      `
    );
    document.getElementById('listFilms').onclick = ()=>{this.showFilms();}
  }
}

const init = function() {
  const filmBrowserApp = new FilmBrowserApp();
  document.getElementById("searchBtn").onclick = ()=>{
    filmBrowserApp.searchFilms(document.getElementById('searchText').value)
  }
}

window.onload = init;
