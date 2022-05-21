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

function loadAllContent() {
    // Load the portfolio items, sorted by year
    loadJSON(function (items) {
        items.sort(function (a, b) {
            return b.year - a.year;
        });

        var years = [];
        var tags = [];

        // Loop through all items
        for (var i = 0; i < items.length; i++) {
            // If we haven't generated a year "card" for the item yet, generate that first
            if (!years.includes(items[i].year)) {
                years.push(items[i].year);

                document.getElementById('portfolio').innerHTML += `
            <div class="container-fluid py-2 row">
            <div class="d-flex flex-col flex-wrap overflow-auto card-deck" id="portfolio-${items[i].year}">
        
            </div>
          </div>
            `;
                // add year item to DOM
                document.getElementById(`portfolio-${items[i].year}`).innerHTML += `
            <div class="my-auto">
            <div class="card card-year">
              <div class="card-body d-flex align-items-center justify-content-center">
                <p class="card-title"> ${items[i].year}</p>
                <div class="container-fluid py-2 row">
                <select class="form-select" aria-label="Default select example">
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
                <option value="2018">2018</option>
                <option value="2017">2017</option>
              </select>
              </div>
            </div>
          </div>
            `;
            }

            var cardMeta = "";
            var tagFilterButtons = "";

            //Sort the tag list on an item alphabetically
            items[i].tags.sort();
            //Generate the tag list string & card metadata
            var tagList = "[";
            for (var j = 0; j < items[i].tags.length; j++) {
                cardMeta += items[i].tags[j] + ", ";
                tagList += "\"" + items[i].tags[j] + "\", ";

                if (!tags.includes(items[i].tags[j])) {
                    tags.push(items[i].tags[j]);
                }
            }

            // Remove unnecessary chars from end of meta & tag list
            cardMeta = cardMeta.slice(0, -2);

            tagList = tagList.slice(0, -1);
            tagList += "\"";

            //Generate list of links for the card
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

            //Generate the card using the above info & add to DOM
            document.getElementById(`portfolio-${items[i].year}`).innerHTML += `
        <div class="mt-5 card-portfolio-parent" data-tagList=${items[i].tags} data-year=${items[i].year}>
            <div class="card card-portfolio">
                <img class="card-img-top" src="../images/${items[i].image}" alt="${items[i].imageAlt}">
                <div class="card-body">
                    <p class="card-title">${items[i].title}</p>
                    <p class="card-meta">${cardMeta}</p>
                    <p class="card-text">${items[i].description}</p>
                    ${links}
                </div> 
            </div>
        </div>
        `;
        }

        // Sort all the tags alphabetically
        tags.sort();
        //For each tag add a filter button
        for (var i = 0; i < tags.length; i++) {
            tagFilterButtons += `
        <input type=\"checkbox\" class=\"btn-check\" id=\"${tags[i]}\" autocomplete=\"off\" OnClick>
        <label class=\"btn btn-outline-primary\" for=\"${tags[i]}\">${tags[i]}</label>
        `
        }
        // add all buttons to the DOM
        document.getElementById('tag-filters').innerHTML += `${tagFilterButtons}`;

        //Add a listener to each tag, which filters the cards based on the tag selected
        for (var i = 0; i < tags.length; i++) {
            document.getElementById(tags[i]).addEventListener('change', function () {
                var portfolioItems = document.getElementsByClassName("card-portfolio-parent");
                if (this.checked) {
                    var inputs = document.getElementsByTagName("input");

                    for (var j = 0; j < inputs.length; j++) {
                        if (inputs[j].type == "checkbox") {
                            if (inputs[j].checked && inputs[j] != this) {
                                inputs[j].checked = false;
                            }
                        }
                    }
                    for (var j = 0; j < portfolioItems.length; j++) {
                        portfolioItems[j].removeAttribute("hidden");
                        if (!portfolioItems[j].getAttribute("data-tagList").includes(this.id)) {
                            portfolioItems[j].setAttribute("hidden", "");
                        }
                    }
                } else {
                    for (var j = 0; j < portfolioItems.length; j++) {
                        portfolioItems[j].removeAttribute("hidden");
                    }
                }
            });
        }

    });
}

var yearsDict = {};

function loadSingleRow() {
    // Load the portfolio items, sorted by year
    loadJSON(function (items) {
        items.sort(function (a, b) {
            return b.year - a.year;
        });

        var years = [];
        var tags = [];

        document.getElementById('portfolio').innerHTML += `
        <div class="container-fluid py-2 row">
            <div class="d-flex flex-col flex-wrap overflow-auto justify-content-center card-deck" id="portfolio-items">

            </div>
        </div>
        `;

        // Loop through all items
        for (var i = 0; i < items.length; i++) {
            // If we haven't generated a year "card" for the item yet, generate that first
            if (!years.includes(items[i].year)) {
                years.push(items[i].year);
                yearsDict[items[i].year] = "";
                /*
                yearsDict[items[i].year] = `
                <div class="my-auto">
                    <div class="card card-year">
                        <div class="card-body d-flex align-items-center justify-content-center">
                            <div class="container-fluid py-2 row">

                            </div>
                        </div>
                    </div>
                </div>`;
                yearsDict[items[i].year] = yearsDict[items[i].year].replace(`value="${items[i].year}"`, `"value="${items[i].year}" selected`);
*/
            }

            var cardMeta = "";

            //Sort the tag list on an item alphabetically
            items[i].tags.sort();
            //Generate the tag list string & card metadata
            var tagList = "[";
            for (var j = 0; j < items[i].tags.length; j++) {
                cardMeta += items[i].tags[j] + ", ";
                tagList += "\"" + items[i].tags[j] + "\", ";

                if (!tags.includes(items[i].tags[j])) {
                    tags.push(items[i].tags[j]);
                }
            }

            // Remove unnecessary chars from end of meta & tag list
            cardMeta = cardMeta.slice(0, -2);

            tagList = tagList.slice(0, -1);
            tagList += "\"";

            //Generate list of links for the card
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

            //Generate the card using the above info & add to DOM

            yearsDict[items[i].year] += `
                <div class="mt-5 card-portfolio-parent" data-tagList=${items[i].tags} data-year=${items[i].year}>
                    <div class="card card-portfolio">
                        <img class="card-img-top" src="../images/${items[i].image}" alt="${items[i].imageAlt}">
                        <div class="card-body">
                            <p class="card-title">${items[i].title}</p>
                            <p class="card-meta">${cardMeta}</p>
                            <p class="card-text">${items[i].description}</p>
                            ${links}
                        </div> 
                    </div>
                </div>
                `;
            }
            document.getElementById(`portfolio-items`).innerHTML = yearsDict[2022];
    });
}

function checkAlert(evt) {
      document.getElementById(`portfolio-items`).innerHTML = yearsDict[evt.target.value];

    
  }

loadSingleRow();
//loadAllContent();
