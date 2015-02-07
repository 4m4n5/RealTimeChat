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

//rejects functioning
var numRejects = 0;
var topics = ["Game of Thrones", "Star Wars", "Star Trek", "Intersteller"];
var topicNum = 0;

 

mongo.connect('mongodb://aman:thermo999@ds063870.mongolab.com:63870/chat', function(err, db){
    if (err) throw err;
    
    //starting socket.io integration
    var io = require('socket.io').listen(app.listen(port));

    //recieving message from client and sending to others
    io.sockets.on('connection', function (socket) {
        
        //showing older messages
        var col = db.collection('messages');
        col.find().limit(100).sort({_id: -1}).toArray(function(err, res){
            if(err) throw err;
            socket.emit('output', res);
        });
        
        //showing no of users on connection
        numUsers += 1;
        socket.emit('userNum',{ userNum: numUsers });
        socket.broadcast.emit('userNum',{ userNum: numUsers });
        
        //showing 'previous messages' message
        socket.emit('message', { message: '</p><div class="prev-msgs-welcome-msg">Previous Messages</div><p>' });
        
        //on sending message
        socket.on('send', function (data) {
            col.insert({ name: data.name, message: data.message }, function(){
                io.sockets.emit('message', data);
            });
        });
        
        //refreshing topic on connection
        socket.emit('changeTopic', {value: topics[topicNum]});
        
        //on topic change
        socket.on('topic', function(data){
            numRejects++;
            if (numRejects >= numUsers/3){
                topicNum++;
                numRejects = 0;
                socket.emit('changeTopic', {value: topics[topicNum]});
                socket.broadcast.emit('changeTopic', {value: topics[topicNum]});
            }
        });

        //on disconnection
        socket.on('disconnect', function(){
            numUsers -= 1;
            socket.broadcast.emit('userNum', { userNum: numUsers });
        });
    });

    console.log("Listening on port " + port);
    
});
