var http = require("http");
var server = http.createServer(function (request, response) {
    response.writeHead(200, {"Content-Type": "application/javascript"});
    response.end(JSON.stringify(process.env));
});
server.listen(4000);
console.log("Server running at http://127.0.0.1:4000/");