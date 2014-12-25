var express = require("express");
var app = express();
var port = process.env.PORT || 3000;

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

//usernames currently in chat
var usernames = {};
var numUsers = 0;

//starting socket.io integration
var io = require('socket.io').listen(app.listen(port));

//recieving message from client and sending to others
io.sockets.on('connection', function (socket) {
    numUsers += 1;
    socket.emit('userNum',{ userNum: numUsers });
    socket.broadcast.emit('userNum',{ userNum: numUsers });
    socket.emit('message', { message: 'Welcome to Black Pigeon. A real time web chat engine!' });
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
    
    socket.on('disconnect', function(){
        numUsers -= 1;
        socket.broadcast.emit('userNum', { userNum: numUsers });
    });
});

console.log("Listening on port " + port);