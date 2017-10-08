var http = require('http');
var fs = require('fs');
var path = require('path');

http.createServer(function (request, response) {
    console.log('request starting...',request.url);

    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './views/index.html';

    if(filePath == './server/updateDB'){
        let body = [];
        request.on('data', (chunk) => {
          body.push(chunk);
        }).on('end', () => {
          var data = Buffer.concat(body).toString();
          console.log("data - ",data);
          fs.writeFileSync('./js/DB.json',data);
          response.writeHead(200, { 'Content-Type': 'application/json' });
          response.end("{ 'success' : 'Data Updated'}" , 'utf-8');
        });
    }
    else{
        var extname = path.extname(filePath);
        var contentType = 'text/html';
        switch (extname) {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.json':
                contentType = 'application/json';
                break;
            case '.png':
                contentType = 'image/png';
                break;      
            case '.jpg':
                contentType = 'image/jpg';
                break;
            case '.wav':
                contentType = 'audio/wav';
                break;
        }
    
        console.log("filePath = ",filePath);
    
        fs.readFile(filePath, function(error, content) {
            if (error) {
                if(error.code == 'ENOENT'){
                    console.log('error occurred');
                    fs.readFile('./404.html', function(error, content) {
                        response.writeHead(200, { 'Content-Type': contentType });
                        response.end(content, 'utf-8');
                    });
                }
                else {
                    response.writeHead(500);
                    response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                    response.end(); 
                }
            }
            else {
                response.writeHead(200, { 'Content-Type': contentType });
                response.end(content, 'utf-8');
            }
        });
    }

}).listen(8125);
console.log('A running at http://127.0.0.1:8125/');