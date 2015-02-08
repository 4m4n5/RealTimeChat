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
var topics = ["Game of Thrones", "Star Wars", "Star Trek", "Interstellar"];
var topicPriority = [1, 1, 1, 1];
var topicNum = 0;
var time = (5)*100;


 

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
        socket.emit('message', { name: 'Shinigami', message: '<div class="prev-msgs-welcome-msg">Previous Messages</div>' });
        
        //on sending message
        socket.on('send', function (data) {
            col.insert({ name: data.name, message: data.message }, function(){
                io.sockets.emit('message', data);
            });
        });
        
        //refreshing topic on connection
        socket.emit('changeTopic', {value: topics[topicNum]});
        
        //on topic change for changing current topic based on rejects
        socket.on('topic', function(data){
            numRejects++;
            if (numRejects >= numUsers/3 || data.value == 42){
                topicNum++;
//                time += (5*numUsers)*100;
//                setTimeout(function(){
//                    socket.emit('topic', {value: 42 });
//                },time);
                if (topicNum === topics.length){
                    topicNum = 0;
                }
                numRejects = 0;
                socket.emit('changeTopic', {value: topics[topicNum], time: time});
                socket.broadcast.emit('changeTopic', {value: topics[topicNum], time: time});
            }
        });
        
        //on append topic call
        socket.on('appendTopic', function(data){
            topics.push(data.value);
            topicPriority.push(1);
        });
        
        //on topicList call for displaying list of topics
        socket.on('topicList', function(data){
            for(var i = topicNum + 1; i < topics.length; i++ ){
                socket.emit('topicListElement', {value: topics[i]});
//                socket.broadcast.emit('topicListElement', {value: topics[i]});
            }
            for(var j = 0; j <= topicNum; j++ ){
                socket.emit('topicListElement', {value: topics[j]});
//                socket.broadcast.emit('topicListElement', {value: topics[i]});
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
