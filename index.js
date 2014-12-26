var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
var mongo = require('mongodb').MongoClient;

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
var names = {};
var numUsers = 0;

mongo.connect('mongodb://aman:thermo999@ds063870.mongolab.com:63870/chat', function(err, db){
    if (err) throw err;
    
    //starting socket.io integration
    var io = require('socket.io').listen(app.listen(port));

    //recieving message from client and sending to others
    io.sockets.on('connection', function (socket) {
        
        //showing older messages
        var col = db.collection('messages');
        socket.emit('message', col.find().limit(100).sort({_id: 1}));
        
        
        
        //showing no of users on connection
        numUsers += 1;
        socket.emit('userNum',{ userNum: numUsers });
        socket.broadcast.emit('userNum',{ userNum: numUsers });
        
        //showing welcome message
        socket.emit('message', { message: 'Welcome to Raven! A real time web chat engine.' });
        
        //on sending message
        socket.on('send', function (data) {
            io.sockets.emit('message', data);
        });

        //on disconnection
        socket.on('disconnect', function(){
            numUsers -= 1;
            socket.broadcast.emit('userNum', { userNum: numUsers });
        });
    });

    console.log("Listening on port " + port);
    
});