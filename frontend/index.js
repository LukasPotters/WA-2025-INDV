let pageNumber = 1;
let itemsPerPage = 5;

const sortFuncs = {
    "name-asc": (a, b) => a.name.localeCompare(b.name),
    "name-desc": (a, b) => b.name.localeCompare(a.name),
    "duration-asc": (a, b) => a.duration - b.duration,
    "duration-desc": (a, b) => b.duration - a.duration,
    "complexity-asc": (a, b) => a.complexity - b.complexity,
    "complexity-desc": (a, b) => b.complexity - a.complexity,
};

function reloadItems() {
    let filteredItems = items.filter(item => {
        const playerCountFilter = document.getElementById("player-count-filter").value;
        if (playerCountFilter == "all") {
            return true;
        }
        return item.playerCount == playerCountFilter;
    });

    const sortOrder = document.getElementById("sort-order").value;
    filteredItems.sort(sortFuncs[sortOrder]);


    const container = document.getElementById("container");
    container.innerHTML = "";

    const pageNumberElement = document.getElementById("page");
    pageNumberElement.textContent = pageNumber;
    document.title = "Page " + pageNumber;

    if (pageNumber == 1) {
        document.getElementById("prev").disabled = true;
    } else {
        document.getElementById("prev").disabled = false;
    }

    if (pageNumber == Math.ceil(filteredItems.length / itemsPerPage)) {
        document.getElementById("next").disabled = true;
    } else {
        document.getElementById("next").disabled = false;
    }

    for(let i=(pageNumber-1)*itemsPerPage; i<pageNumber*itemsPerPage; i++) {
        const item = filteredItems[i];

        if (!item) {
            break;
        }
    
        const div = createDiv(item);
        container.appendChild(div);
    }
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

function createGame(event) {
    event.preventDefault();

    const nameElement = document.getElementById('name');
    const durationElement = document.getElementById('duration');
    const complexityElement = document.getElementById('complexity');
    const playerCountElement = document.getElementById('playerCount');

    items.push({
        name: nameElement.value,
        duration: +durationElement.value,
        complexity: +complexityElement.value,
        playerCount: playerCountElement.value,
        image: 'images/placeholder.png'
    });

    closeCreateForm();

    reloadItems();
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