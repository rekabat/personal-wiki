function parse(md, prevLinks) {
    return md;
}

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

var title = "My Stuff";
var links = [
    {
        title: "Favorite Food",
        content: "Cheetos, *burritos*, and ice cream"
    },
    {
        title: "Todo list",
        content: "cook, *shop*, learn to dance"
    },
];
var defaultSnack = 1;

loadNav();
loadSnack(getSnack());

function loadNav() {
    var titleEle = document.getElementById("wiki-title");
    titleEle.textContent = title;
}

function getSnack() {
    var h = window.location.hash;
    if (h) {
        h = parseInt(h.slice(1));
        if (h !== NaN) {
            return h;
        }
    }
    return defaultSnack;
}

function loadSnack(index) {
    clearSnack();

    var titleEle = document.createElement("div");
    titleEle.setAttribute("id", "snack-title");
    titleEle.textContent = links[index].title;

    var contentEle = document.createElement("div");
    contentEle.setAttribute("id", "snack-content");
    contentEle.innerHTML = parse(links[index].content);
    // contentEle.textContent = links[index].content;
    
    var snackEle = document.getElementById("content-right");
    snackEle.appendChild(titleEle);
    snackEle.appendChild(contentEle);
}

function clearSnack() {
    var snackEle = document.getElementById("content-right");
    while (snackEle.firstChild) {
        snackEle.removeChild(snackEle.firstChild);
    }
}

function navHome() {
    loadSnack(defaultSnack);
}

function navAllLinks() {
    clearSnack();

    var titleEle = document.createElement("div");
    titleEle.setAttribute("id", "snack-title");
    titleEle.textContent = "All Links";

    var contentEle = document.createElement("div");
    contentEle.setAttribute("id", "snack-content");
    
    for (var i = 0; i < links.length; i++) {
        var l = document.createElement("p")
        l.textContent = links[i].title;
        contentEle.appendChild(l);
    }

    var snackEle = document.getElementById("content-right");
    snackEle.appendChild(titleEle);
    snackEle.appendChild(contentEle);
}