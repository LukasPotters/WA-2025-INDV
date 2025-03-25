const express = require('express')
const path = require('path')
const fs = require('fs')


const app = express()
const port = 3000

const json = fs.readFileSync('items.json');
const items = JSON.parse(json);

const sortFuncs = {
  "name-asc": (a, b) => a.name.localeCompare(b.name),
  "name-desc": (a, b) => b.name.localeCompare(a.name),
  "duration-asc": (a, b) => a.duration - b.duration,
  "duration-desc": (a, b) => b.duration - a.duration,
  "complexity-asc": (a, b) => a.complexity - b.complexity,
  "complexity-desc": (a, b) => b.complexity - a.complexity,
};

function getItems(pageNumber, pageSize, playerCountFilter, sortOrder) {
  let filteredItems = items.filter(item => {
      if (playerCountFilter == "all") {
          return true;
      }
      return item.playerCount == playerCountFilter;
  });

  filteredItems.sort(sortFuncs[sortOrder]);

  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return filteredItems.slice(startIndex, endIndex);
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
});

app.get('/api/items', (req, res) => {
  const pageNumber = req.query.page || 1;
  const pageSize = req.query.size || 5;

  const playerCountFilter = req.query.playerCountFilter || "all";
  const sortOrder = req.query.sortOrder || "name-asc";

  const items = getItems(pageNumber, pageSize, playerCountFilter, sortOrder);

  res.json(items);
});

app.get('/api/page-count', (req, res) => {
  const pageSize = req.query.size || 5;

  const pageCount = Math.ceil(items.length / pageSize);

  res.json({ pageCount });
});

app.use(express.static(path.join(__dirname, '/public')));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
