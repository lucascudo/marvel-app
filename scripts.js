$( document ).ready(() => {
    const comicsSectionEl = $("#comics");
    const comicsContainerEl = $("#comics-container");
    const detailsContainerEl = $("#details-container");
    let apiKey;
    detailsContainerEl.hide();

    function searchComics(startWith) {
        let url = "http://gateway.marvel.com/v1/public/comics?apikey=" + apiKey;
        if(typeof startWith === "string" && startWith.length) url += "&titleStartsWith=" + startWith;

        $.get(url, data => {
            comicsSectionEl.innerHTML = "";
            data.data.results.filter(result => result.images.length).slice(0, 6).forEach(result => {
                const div = $("<div>"); // Create a <p> node
                const image = $("<img>");  // Create a text node
                image.attr("src", `${result.thumbnail.path}/landscape_xlarge.${result.thumbnail.extension}`);
                div.append(image);
                div.addClass("col-12 col-xs-6 col-lg-4 mt-5 item");
                div.click(() => { // Capture click event
                    // Hide listing page and show details page
                    comicsContainerEl.hide();
                    detailsContainerEl.show();
                    // Fill details page data
                    const finalYear = new Date(result.dates[0].date).getFullYear();
                    const initialYear = new Date(result.dates[1].date).getFullYear();

                    $("#details-title").html(result.title);
                    $("#details-description").html(result.description);
                    $("#details-years").html(initialYear + " - " + finalYear);
                    $("#details-img").html(image);
                });
                comicsSectionEl.append(div);
            })
        });
    }

    $.get("/api.key", textResponse => {
        apiKey = textResponse;
        searchComics();
    });

    const searchInputEl = $("#search");
    searchInputEl.keyup(e => searchComics(searchInputEl.value));

    $("#details-back").click(() => {
        detailsContainerEl.hide();
        comicsContainerEl.show();
    });

});