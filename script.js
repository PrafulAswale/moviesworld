// Here is your key: 89b13314
// Titles: https://omdbapi.com/?s=thor&page=1&apikey=89b13314
// details: http://www.omdbapi.com/?i=tt3896198&apikey=89b13314

const movieSearchBox = document.getElementById("movie-search-box");
const searchList = document.getElementById("search-list");
const resultGrid = document.getElementById("result-grid");
const favSection = document.getElementById("myFavorites");

addFavToList();
let favBtn;
let favMovieArray = [];
let data;
// load movies from API
async function loadMovies(searchTerm) {
  const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=89b13314`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  //console.log(data.Search);
  if (data.Response == "True") displayMovieList(data.Search);
}

function findMovies() {
  let searchTerm = movieSearchBox.value.trim();
  if (searchTerm.length > 0) {
    searchList.classList.remove("hide-search-list");
    loadMovies(searchTerm);
  } else {
    searchList.classList.add("hide-search-list");
  }
}

function displayMovieList(movies) {
  searchList.innerHTML = "";
  for (let idx = 0; idx < movies.length; idx++) {
    let movieListItem = document.createElement("div");
    movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
    movieListItem.classList.add("search-list-item");
    if (movies[idx].Poster != "N/A") moviePoster = movies[idx].Poster;
    else moviePoster = "/images/image_not_found.png";

    movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
    searchList.appendChild(movieListItem);
  }
  loadMovieDetails();
}

function loadMovieDetails() {
  const searchListMovies = searchList.querySelectorAll(".search-list-item");
  searchListMovies.forEach((movie) => {
    movie.addEventListener("click", async () => {
      // console.log(movie.dataset.id);
      searchList.classList.add("hide-search-list");
      movieSearchBox.value = "";
      const result = await fetch(
        `https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=89b13314`
      );
      const movieDetails = await result.json();
      // console.log(movieDetails);
      displayMovieDetails(movieDetails);
    });
  });
}

function displayMovieDetails(details) {
  data = details;
  resultGrid.innerHTML = `
    <div class = "movie-poster">
        <button class="fav-btn">
          <i class="fa-solid fa-heart add-fav" data-id="${details.Title}"></i>
        </button>
        <img src = "${
          details.Poster != "N/A"
            ? details.Poster
            : "/images/image_not_found.png"
        }" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${
          details.Awards
        }</p>
    </div>
    `;
}

// to open favorites section

let flag = true;
function openClose(){
  if(flag){
    openNav();
    flag = false;
  }else{
    closeNav();
    flag = true;
  }
}
function openNav() {
  document.getElementById("myFavorites").style.width = "400px";
}
//to close favorites section
function closeNav() {
  document.getElementById("myFavorites").style.width = "0";
}

//add to favorite of localstorage
function handleFavBtn (){
  let favMovieLocal = localStorage.getItem("favList");
  // console.log(JSON.stringify(data));
  if(favMovieLocal){
    favMovieArray = Array.from(JSON.parse(favMovieLocal));
  }else{
    localStorage.setItem("favList", JSON.stringify(data));
  }

  //to chcek if movie is already present in the fav list
  let isPresent = false;
  favMovieArray.forEach((movie)=>{
    if(data.Title == movie.Title){
      alert("already added to favorites list");
      isPresent = true;
    }
  });

  if(!isPresent){
    favMovieArray.push(data);
  }

  localStorage.setItem("favList", JSON.stringify(favMovieArray));
  isPresent = !isPresent;
  addFavToList();
  openNav();
}

//add to favorites list
function addFavToList() {
  favSection.innerHTML = `<h3 style="color:  #FFC52D;">Favorites Movies</h3>`;
  let favList = JSON.parse(localStorage.getItem("favList"));
  if (favList) {
    favList.forEach((movie) => {
      const div = document.createElement("div");
      div.classList.add(
        "fav-movie-card",
        "d-flex",
        "justify-content-between",
        "align-content-center",
        "my-2"
      );
      div.innerHTML = `
 
  <img
    src="${movie.Poster}"
    alt=""
    class="fav-movie-poster"
  />
  <div class="movie-card-details">
    <p class="movie-name mt-3 mb-0">
     <a href = "#"  class="fav-movie-name" data-id="${movie.Title}">${movie.Title}<a> 
    </p>
    <small class="text-muted">${movie.Year}</small>
  </div>
  <div class="delete-btn my-4">
      <i class="fa-solid fa-trash-can" data-id="${movie.Title}"></i>
  </div>
  `;
      favSection.append(div);
    });
  }
}

//delete from favorite list
function deleteFavMovie(name) {
  let favList = JSON.parse(localStorage.getItem("favList"));
  let updatedList = Array.from(favList).filter((movie) => {
    return movie.Title != name;
  });

  localStorage.setItem("favList", JSON.stringify(updatedList));
  addFavToList();
}

async function handleClickListner(event){
  const target = event.target;
  
  if(target.classList.contains("add-fav")){
    event.preventDefault();
    handleFavBtn();
  }else if(target.classList.contains("fa-trash-can")){
    console.log("clicked");
    deleteFavMovie(target.dataset.id);
  }else if (target.className != "form-control") {
    searchList.classList.add("hide-search-list");
  }

  localStorage.setItem("movieName", target.dataset.id);
}

window.addEventListener("click", handleClickListner);
