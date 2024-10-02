const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const FILE_PATH = path.join(__dirname, 'shopping-list.json');


const initFile = () => {
    if (!fs.existsSync(FILE_PATH)) {
        fs.writeFileSync(FILE_PATH, JSON.stringify([]));
    }
};

initFile();


const readData = () => {
    const data = fs.readFileSync(FILE_PATH);
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
};


const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.url === '/shopping-list' && req.method === 'GET') {
        const data = readData();
        res.writeHead(200);
        res.end(JSON.stringify(data));
    } else if (req.url === '/shopping-list' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const newItem = JSON.parse(body);
            const data = readData();
            data.push(newItem);
            writeData(data);
            res.writeHead(201);
            res.end(JSON.stringify(newItem));
        });
    } else if (req.url.startsWith('/shopping-list/') && req.method === 'PUT') {
        const id = req.url.split('/').pop();
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const updatedItem = JSON.parse(body);
            const data = readData();
            data[id] = updatedItem;
            writeData(data);
            res.writeHead(200);
            res.end(JSON.stringify(updatedItem));
        });
    } else if (req.url.startsWith('/shopping-list/') && req.method === 'DELETE') {
        const id = req.url.split('/').pop();
        const data = readData();
        const removedItem = data.splice(id, 1);
        writeData(data);
        res.writeHead(200);
        res.end(JSON.stringify(removedItem));
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
});


server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
