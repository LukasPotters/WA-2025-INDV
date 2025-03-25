let pageNumber = 1;
let itemsPerPage = 5;

function reloadItems() {
    const playerCountFilter = document.getElementById("player-count-filter").value;
    const sortOrder = document.getElementById("sort-order").value;
    const pageNumberElement = document.getElementById("page");
    pageNumberElement.textContent = pageNumber;
    document.title = "Page " + pageNumber;

    const items = fetch(`/api/items?page=${pageNumber}&size=${itemsPerPage}&playerCountFilter=${playerCountFilter}&sortOrder=${sortOrder}`)
        .then(res => res.json());

    items.then(items => {
        const container = document.getElementById("container");
        container.innerHTML = "";

        if (pageNumber == 1) {
            document.getElementById("prev").disabled = true;
        } else {
            document.getElementById("prev").disabled = false;
        }

        const pageCount = fetch(`/api/page-count?size=${itemsPerPage}`)
            .then(res => res.json())
            .then(data => data.pageCount);

        pageCount.then(pageCount => {

            if (pageNumber == pageCount) {
                document.getElementById("next").disabled = true;
            } else {
                document.getElementById("next").disabled = false;
            }
        });

        for(const item of items) {
            const div = createDiv(item);
            container.appendChild(div);
        }
    });
}

function createDiv(item) {
    const div = document.createElement("div");
    div.classList.add("item");

    const itemData = document.createElement("div");

    const img = document.createElement("img");
    img.alt = item.name + " Board Game"
    img.src = item.image;
    div.appendChild(img);

    const name = document.createElement("h2");
    name.textContent = item.name;
    itemData.appendChild(name);

    const duration = document.createElement("p");
    duration.textContent = item.duration + " min";
    itemData.appendChild(duration);

    const playerCount = document.createElement("p");
    playerCount.textContent = item.playerCount + " players";
    itemData.appendChild(playerCount)

    const complexity = document.createElement("p");
    complexity.textContent = item.complexity + "/5 complexity";
    itemData.appendChild(complexity);
    
    div.appendChild(itemData);
    return div;
}

function changePage(change) {
    pageNumber += change;
    reloadItems();
}

function showCreateForm() {
    const formElement = document.getElementById("form-background");
    formElement.style.display = "flex";
}

function closeCreateForm() {
    const nameElement = document.getElementById('name');
    const durationElement = document.getElementById('duration');
    const complexityElement = document.getElementById('complexity');
    const playerCountElement = document.getElementById('playerCount');
    
    document.getElementById('form-background').style.display = 'none';

    nameElement.value = "";
    durationElement.value = "";
    complexityElement.value = "";
    playerCountElement.value = "";
}

document.getElementById("player-count-filter").onchange = () => {
    pageNumber = 1;
    reloadItems();
}

document.getElementById("sort-order").onchange = () => {
    pageNumber = 1;
    reloadItems();
}

reloadItems();