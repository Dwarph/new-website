function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', '../data/portfolioData.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(JSON.parse(xobj.responseText));
        }
    };
    xobj.send(null);
}

loadJSON(function (items) {
    console.log(items); // this will log out the json object

    items.sort(function (a, b) {
        return b.year - a.year;
    });

    var years = [];

    for (var i = 0; i < items.length; i++) {
        if (!years.includes(items[i].year)) {
            years.push(items[i].year);

            // add year item to DOM
            document.getElementById('portfolio').innerHTML += `
            <div class="my-auto">
            <div class="card card-year">
              <div class="card-body d-flex align-items-center justify-content-center">
                <p class="card-title"> ${items[i].year} </p>
              </div>
            </div>
          </div>
            `;
        }

        var cardMeta = "";
        for (var j = 0; j < items[i].tags.length; j++) {
            cardMeta += items[i].tags[j] + ", ";
        }
        cardMeta = cardMeta.slice(0, -2);
        var links = "";
        if (items[i].links != undefined) {
            for (var j = 0; j < items[i].links.length; j++) {
               links += `
                <p class="card-text">
                ${items[i].links[j].text} <a href=\"${items[i].links[j].link}\">here</a>
                </p>
                `;
            }
        }
        // add portfolio item to DOM
        document.getElementById('portfolio').innerHTML += `
        <div class="mt-5">
        <div class="card card-portfolio">
        <img class="card-img-top" src="../images/${items[i].image}" alt="${items[i].imageAlt}">
        <div class="card-body">
        <p class="card-title">${items[i].title}</p>
        <p class="card-meta">${cardMeta}</p>
        <p class="card-text">
        ${items[i].description}
        </p>
        ${links}
        </div>
        </div>
        </div>
        `;



    }
});