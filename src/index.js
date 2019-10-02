const $app = document.getElementById("app");
const $observe = document.getElementById("observe");
const API = "https://rickandmortyapi.com/api/character/";
// const API = "https://us-central1-escuelajs-api.cloudfunctions.net/characters";
var counter = 0;
const MaxPage = 2;
localStorage.clear();

const getData = api => {
  return fetch(api).then(response => response.json());
};

const renderData = function(data) {
  const next = data.info.next;
  localStorage.setItem("next_fetch", next);
  console.log(localStorage.getItem("next_fetch"));

  const characters = data.results;
  let output = characters
    .map(character => {
      return `
      <article class="Card">
    <img src="${character.image}" />
    <h2>${character.name}<span>${character.species}</span></h2>
  </article>
  `;
    })
    .join("");
  let newItem = document.createElement("section");
  newItem.classList.add("Items");
  newItem.innerHTML = output;
  $app.appendChild(newItem);
};

const loadData = async function(url) {
  const data = await getData(url);
  renderData(data);
};

const intersectionObserver = new IntersectionObserver(
  entries => {
    if (entries[0].isIntersecting) {
      if (localStorage.getItem("next_fetch") && counter < MaxPage) {
        counter++;
        let next_fetch = localStorage.getItem("next_fetch");
        loadData(next_fetch);
      } else if (counter === MaxPage) {
        alert("Se acabaron los personajes");
        intersectionObserver.unobserve($observe);
      } else {
        loadData(API);
      }
      console.log(counter);
    }
  },
  {
    rootMargin: "0px 0px 100% 0px"
  }
);

intersectionObserver.observe($observe);
