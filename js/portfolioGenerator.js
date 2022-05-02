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
    items.sort(function (a, b) {
        return b.year - a.year;
    });

    var years = [];
    var tags = [];

    for (var i = 0; i < items.length; i++) {
        if (!years.includes(items[i].year)) {
            years.push(items[i].year);

            // add year item to DOM
            document.getElementById('portfolio').innerHTML += `
            <div class="my-auto">
            <div class="card card-year">
              <div class="card-body d-flex align-items-center justify-content-center">
                <p class="card-title"> ${items[i].year}</p>
              </div>
            </div>
          </div>
            `;
        }

        var cardMeta = "";
        var tagFilterButtons = "";
        var tagList = "[";
        for (var j = 0; j < items[i].tags.length; j++) {
            cardMeta += items[i].tags[j] + ", ";
            tagList += "\"" + items[i].tags[j] + "\", ";

            if (!tags.includes(items[i].tags[j])) {
                tags.push(items[i].tags[j]);
            }
        }


        cardMeta = cardMeta.slice(0, -2);

        tagList = tagList.slice(0, -1);
        tagList += "\"";

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
        <div class="mt-5 card-portfolio-parent" data-tagList=${items[i].tags}>
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

    tags.sort();
    for (var i = 0; i < tags.length; i++) {
        tagFilterButtons += `
        <input type=\"checkbox\" class=\"btn-check\" id=\"${tags[i]}\" autocomplete=\"off\" OnClick>
        <label class=\"btn btn-outline-primary\" for=\"${tags[i]}\">${tags[i]}</label>
        `
    }
    document.getElementById('tag-filters').innerHTML += `
    ${tagFilterButtons}
    `;

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