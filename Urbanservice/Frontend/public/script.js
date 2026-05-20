function searchService() {

let input = document.getElementById("searchBar").value.toLowerCase();

let services = document.getElementsByClassName("card");

for (let i = 0; i < services.length; i++) {

let title = services[i].getElementsByTagName("h3")[0].innerText.toLowerCase();
let desc = services[i].getElementsByTagName("p")[0].innerText.toLowerCase();
let isHidden = services[i].classList.contains("hidden-service");

if (input === "") {
    // If search is empty, show only non-hidden services
    if (isHidden) {
        services[i].style.display = "none";
    } else {
        services[i].style.display = "block";
    }
} else {
    // If searching, show matching services (including hidden ones)
    // Check both title and description
    if (title.includes(input) || desc.includes(input) || input.includes(title.substring(0, input.length))) {
        services[i].style.display = "block";
    } else {
        services[i].style.display = "none";
    }
}

}

}