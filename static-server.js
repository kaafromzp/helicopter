const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const baseDirectory = __dirname; // Or whatever base directory you want

const port = process.env.PORT || 8000;

http.createServer((request, response) => {
    try {
        const requestUrl = url.parse(request.url);

        // Need to use path.normalize so people can't access directories underneath baseDirectory
        let urlPathname = path.normalize(requestUrl.pathname);
        if (urlPathname === '\\') {
            urlPathname = '\\index.html';
        }
        const fsPath = baseDirectory + urlPathname;

        const fileStream = fs.createReadStream(fsPath);
        fileStream.pipe(response);
        fileStream.on('open', () => {
            response.writeHead(200);
        });
        fileStream.on('error', (e) => {
            response.writeHead(404); // Assume the file doesn't exist
            response.end();
        });
    } catch (e) {
        response.writeHead(500);
        response.end(); // End the response so browsers don't hang
        console.log(e.stack);
    }
}).listen(port);

console.log(`listening on port ${port}`);
