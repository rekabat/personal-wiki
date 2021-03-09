function parse(md, prevLinks) {
    return md;
}

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

var title = "Default";
var snacks = [];
var homeSnack = 0;
var currentSnack = 0;

loadBanquet();
loadNav();
loadSnack(getSnack());

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function loadBanquet() {
    var banquet = document.getElementById("banquet");

    title = banquet.getAttribute("wiki-title");

    homeSnack = parseInt(banquet.getAttribute("home-snack"));
    if (homeSnack === NaN) homeSnack = 0;

    currentSnack = parseInt(banquet.getAttribute("current-snack"));
    if (currentSnack === NaN) currentSnack = 0;

    var ch = banquet.children;
    snacks = [];
    for (var i = 0; i < ch.length; i++) {
        snacks.push(JSON.parse(ch[i].textContent))
    }
}

function loadNav() {
    var titleEle = document.getElementById("wiki-title");
    titleEle.textContent = title;
    
    var pinned = document.getElementById("wiki-links-pinned");
    clearElement(pinned);
    var pinnedList = document.createElement("ul");
    for (var i = 0; i < snacks.length; i++) {
        if (snacks[i].pinned) {
            var pinnedSnack = document.createElement("li");
            pinnedSnack.textContent = snacks[i].title;
            pinnedSnack.setAttribute("onclick", `loadSnack(${i})`)
            pinnedList.appendChild(pinnedSnack);
        }
    }

    pinned.appendChild(pinnedList);
}

function getSnack() {
    var h = window.location.hash;
    if (h) {
        h = parseInt(h.slice(1));
        if (h !== NaN) {
            return h;
        }
    }
    return currentSnack;
}

function loadSnack(index) {
    // clear
    clearSnack();

    // load snack data
    var titleEle = document.getElementById("snack-title");
    titleEle.textContent = snacks[index].title;

    var contentEle = document.getElementById("snack-content");
    contentEle.innerHTML = parse(snacks[index].content);

    // determine if pinned
    var pinButton = document.getElementById("snack-pin-toggle");
    if (snacks[index].pinned) {
        pinButton.onclick = unpinSnack;
        pinButton.innerText = "Unpin";
    } else {
        pinButton.onclick = pinSnack;
        pinButton.innerText = "Pin";
    }

    // set as current snack
    banquet.setAttribute("current-snack", index);
    currentSnack = index;
}

function clearSnack() {
    clearElement(document.getElementById("snack-title"));
    clearSnackContent();
}

function clearSnackContent() {
    clearElement(document.getElementById("snack-content"));
}

function navHome() {
    loadSnack(homeSnack);
}

function navAllLinks() {
    clearSnack();

    var titleEle = document.getElementById("snack-title");
    titleEle.textContent = "All Snacks";

    var contentEle = document.getElementById("snack-content");
    
    for (var i = 0; i < snacks.length; i++) {
        var l = document.createElement("span")
        l.className = "snack-link";
        l.innerText = snacks[i].title;
        const ic = i;
        l.onclick = () => loadSnack(ic);
        contentEle.appendChild(l);
        contentEle.appendChild(document.createElement("br"));
    }
}

function newSnack() {
    console.log("placeholder");
}

function saveWiki() {
    var content = document.documentElement.outerHTML;
    download(content, "test.html", "text/html;charset=utf-8");
}

function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

function editSnack() {
    clearSnackContent();

    var contentTextbox = document.createElement("textarea");
    contentTextbox.setAttribute("id", "snack-content-edit")
    contentTextbox.value = snacks[currentSnack].content;

    var contentEle = document.getElementById("snack-content");
    contentEle.appendChild(contentTextbox);
}

function saveSnack() {
    var contentTextbox = document.getElementById("snack-content-edit");
    var content = contentTextbox.value;

    var snack = document.getElementById("banquet").children[currentSnack];
    var snackJson = JSON.parse(snack.innerText);
    snackJson.content = content;
    snack.innerText = JSON.stringify(snackJson);

    snacks[currentSnack] = snackJson;

    loadSnack(currentSnack);
}

function pinSnack() {
    var snack = document.getElementById("banquet").children[currentSnack];
    var snackJson = JSON.parse(snack.innerText);
    snackJson.pinned = true;
    snack.innerText = JSON.stringify(snackJson);

    snacks[currentSnack] = snackJson;

    loadNav();
    loadSnack(currentSnack);
}

function unpinSnack() {
    var snack = document.getElementById("banquet").children[currentSnack];
    var snackJson = JSON.parse(snack.innerText);
    delete(snackJson.pinned);
    snack.innerText = JSON.stringify(snackJson);

    snacks[currentSnack] = snackJson;

    loadNav();
    loadSnack(currentSnack);
}