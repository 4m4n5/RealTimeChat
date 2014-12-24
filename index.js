var express = require("express");
var app = express();
var port = 3700;

app.get("/", function(req, res){
    res.send("It Works!");
});

app.listen(port);
console.log("Listening on port " + port);