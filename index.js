var express = require("express");
var app = express();
var port = 3700;

//informing express to use jade
app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
    res.render("page");
});

//sending response
app.get("/", function(req, res){
    res.send("It Works!");
});

//look for static resources
app.use(express.static(__dirname + '/public'));

//listening to port
//app.listen(port);

//starting socket.io integration
var io = require('socket.io').listen(app.listen(port));

//recieving message from client and sending to others
io.sockets.on('connection', function(socket){
    socket.emit('message', { message: 'Welcome to the chat! lulz!' });
    socket.on('send', function(data){
        io.sockets.emit('message', data);
    });
});

console.log("Listening on port " + port);