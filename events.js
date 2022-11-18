document.getElementById("name").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("hbutton").click();
    }
});

document.getElementById("cfhandle").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("hbutton").click();
    }
});

document.getElementById("athandle").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("hbutton").click();
    }
});

document.getElementById("prblm").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("pbutton").click();
    }
});