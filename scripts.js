const comicsSectionEl = document.getElementById("comics");
const comicsContainerEl = document.getElementById("comics-container");
const detailsContainerEl = document.getElementById("details-container");
const apiKey;

function searchComics(startWith) {
    let url = "http://gateway.marvel.com/v1/public/comics?apikey=" + apiKey;
    if(typeof startWith === "string" && startWith.length) url += "&titleStartsWith=" + startWith;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        comicsSectionEl.innerHTML = "";
        data.data.results.filter(result => result.images.length).slice(0, 6).forEach(result => {
            const div = document.createElement("div"); // Create a <p> node
            const image = document.createElement("img");  // Create a text node
            image.src = `${result.thumbnail.path}/landscape_xlarge.${result.thumbnail.extension}`;
            div.appendChild(image);
            div.className ="col-12 col-xs-6 col-lg-4 mt-5 item";
            div.onclick = () => { // Capture click event
                // Hide listing page and show details page
                comicsContainerEl.classList.add("d-none");
                detailsContainerEl.classList.remove("d-none");
                // Fill details page data
                const finalYear = new Date(result.dates[0].date).getFullYear();
                const initialYear = new Date(result.dates[1].date).getFullYear();

                document.getElementById("details-title").innerHTML = result.title;
                document.getElementById("details-description").innerHTML = result.description;
                document.getElementById("details-years").innerHTML = initialYear + " - " + finalYear;
                document.getElementById("details-img").innerHTML = image.outerHTML;
            }
            comicsSectionEl.appendChild(div);
        })
    });
}

fetch("/api.key")
.then(response => response.text())
.then(textResponse => {
    apiKey = textResponse;
    searchComics();
});

const searchInputEl = document.getElementById("search");
searchInputEl.onkeyup = e => searchComics(searchInputEl.value);

document.getElementById("details-back").onclick = () => {
    detailsContainerEl.classList.add("d-none");
    comicsContainerEl.classList.remove("d-none");
}