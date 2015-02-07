window.onload = function() {

    var messages = [];
    var serverBaseUrl = document.domain;
    var socket = io.connect(serverBaseUrl);
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    var prevMsgs = document.getElementById("prevMsgs");
    var newMsgs = document.getElementById("newMsgs");
    var name = document.getElementById("name");
    var numDisp = document.getElementById("numDisp");
    
    name.value = '';
    
    //changing tab title on new message
    var origTitle = document.title;
    var onTab = true;
    var newMsg = false;
    var numNewMsg = 0;
    $(window).focus(function(){
        document.title = origTitle;
        newMsg = false;
        numNewMsg = 0;
        onTab = true;
    });
    
    var changeTitle = function(){
        if(newMsg == true && onTab == false){
            if(numNewMsg == 1){
                document.title = numNewMsg + ' New ' + origTitle;
            }
            else{
                document.title = numNewMsg + ' New ' + origTitle + 's';    
            }
        }
        if(onTab == true){
            newMsg = false;
            numNewMsg = 0;
        }
    }
    
    setInterval(changeTitle, 10);
    
    $(window).blur(function(){
        onTab = false;
    });
    
    
    //for displaying old messages
    socket.on('output', function(data){
        var oldMsg = '';
        if(data.length){
            for(var x = data.length - 1; x >= 0; x -= 1){
                oldMsg += '<div class="message">' + 
                            '<div class="user-name">' + data[x].name + '</div>' +
                            '<div class="user-msg">' + data[x].message + '</div>' + 
                        '</div>';
            }
            prevMsgs.innerHTML = oldMsg;
        }
    });
   
    
    //for displaying new messages
    socket.on('message', function (data) {
        if(data.message) {
            newMsg = true;
            numNewMsg++;
            messages.push(data);
            var html = '';
            for(var i=0; i<messages.length; i++) {
    //             if (i !== 0 && messages[i].name[messages[i].name.length - 2] != ':') {
				// 	messages[i].name += ': ';
				// }
                html += '<div class="message">' + 
                            '<div class="user-name">' + (messages[i].name ? messages[i].name : '') + '</div>' +
                            '<div class="user-msg">' + messages[i].message + '</div>' + 
                        '</div>';
            }
            newMsgs.innerHTML = html;
            content.scrollTop = content.scrollHeight;
        } else {
            console.log("We have a situation: ", data);
        }
    });
    var numUsers = 0;
    socket.on('userNum', function (data) {
        numDisp.innerHTML = data.userNum;
        numUsers = data.userNum;
    });
    
    
    //jQuery for listening to enter keypress
    $(document).ready(function() {
        $("#field").keyup(function(e) {
            if(e.keyCode == 13) {
                sendMessage();
            }
        });
    });
    
//    emoji integration
//    emojify.setConfig({img_dir:'/pngs'});
//    emojify.run(document.getElementById('chat-msg'));
    
    var smile = document.getElementById('emo-smile');
    var smiley = document.getElementById('emo-smiley');
    var laughing = document.getElementById('emo-laughing');
    var blush = document.getElementById('emo-blush');
    var relaxed = document.getElementById('emo-relaxed');
    var grin = document.getElementById('emo-grin');
    var stuck_out_tongue_winking_eye = document.getElementById('emo-stuck_out_tongue_winking_eye');
    var wink = document.getElementById('emo-wink');
    var confused = document.getElementById('emo-confused');
    var sunglasses = document.getElementById('emo-sunglasses');
    var kissing_heart = document.getElementById('emo-kissing_heart');
    var stuck_out_tongue = document.getElementById('emo-stuck_out_tongue');
    var worried = document.getElementById('emo-worried');
    var sleeping = document.getElementById('emo-sleeping');
    var expressionless = document.getElementById('emo-expressionless');
    var unamused = document.getElementById('emo-unamused');
    
    smile.onclick = addImage = function() {
        var html = '<img src= "pngs/smile.png">';
        socket.emit('send', {message: html, name: name.value});
        $('#field').focus();
    }
    
    smiley.onclick = addImage = function() {
        var html = '<img src= "pngs/smiley.png">';
        socket.emit('send', {message: html, name: name.value});
        $('#field').focus();
    }
    
    laughing.onclick = addImage = function() {
        var html = '<img src= "pngs/laughing.png">';
        socket.emit('send', {message: html, name: name.value});
        $('#field').focus();
    }
    
    blush.onclick = addImage = function() {
        var html = '<img src= "pngs/blush.png">';
        socket.emit('send', {message: html, name: name.value});
        $('#field').focus();
    }
    
    relaxed.onclick = addImage = function() {
        var html = '<img src= "pngs/relaxed.png">';
        socket.emit('send', {message: html, name: name.value});
        $('#field').focus();
    }
    
    grin.onclick = addImage = function() {
        var html = '<img src= "pngs/grin.png">';
        socket.emit('send', {message: html, name: name.value});
        $('#field').focus();
    }
    
    stuck_out_tongue_winking_eye.onclick = addImage = function() {
        var html = '<img src= "pngs/stuck_out_tongue_winking_eye.png">';
        socket.emit('send', {message: html, name: name.value});
        $('#field').focus();
    }
    
    wink.onclick = addImage = function() {
        var html = '<img src= "pngs/wink.png">';
        socket.emit('send', {message: html, name: name.value});
        $('#field').focus();
    }
    
    confused.onclick = addImage = function() {
        var html = '<img src= "pngs/confused.png">';
        socket.emit('send', {message: html, name: name.value});
        $('#field').focus();
    }
    
    sunglasses.onclick = addImage = function() {
        var html = '<img src= "pngs/sunglasses.png">';
        socket.emit('send', {message: html, name: name.value});
        $('#field').focus();
    }
    
    
    kissing_heart.onclick = addImage = function() {
        var html = '<img src= "pngs/kissing_heart.png">';
        socket.emit('send', {message: html, name: name.value});
        $('#field').focus();
    }
    
    stuck_out_tongue.onclick = addImage = function() {
        var html = '<img src= "pngs/stuck_out_tongue.png">';
        socket.emit('send', {message: html, name: name.value});
        $('#field').focus();
    }
    
    worried.onclick = addImage = function() {
        var html = '<img src= "pngs/worried.png">';
        socket.emit('send', {message: html, name: name.value});
        $('#field').focus();
    }
    
    sleeping.onclick = addImage = function() {
        var html = '<img src= "pngs/sleeping.png">';
        socket.emit('send', {message: html, name: name.value});
        $('#field').focus();
    }
    
    expressionless.onclick = addImage = function() {
        var html = '<img src= "pngs/expressionless.png">';
        socket.emit('send', {message: html, name: name.value});
        $('#field').focus();
    }
    
    unamused.onclick = addImage = function() {
        var html = '<img src= "pngs/unamused.png">';
        socket.emit('send', {message: html, name: name.value});
        $('#field').focus();
    }
    
    
//  eventlistener for sending message
    sendButton.onclick = sendMessage = function() {
        if(name.value == "" || !field.value){
        }
        else {
            var text = field.value;
            socket.emit('send', { message: text, name: name.value });
            field.value = "";
        }
    };

//  reject feature
    var flag = 1;
    var reject = document.getElementById("rejectButton");
    reject.onclick = rejectFunction = function(e){
        if(flag){
            flag = 0;
            e.preventDefault();
            socket.emit('topic', {value: 1 });
        }
    };

    
//  changing topicBox topic
    socket.on('changeTopic', function(data){
        document.getElementById('topicBox').innerHTML = data.value;
        flag = 1;
    });

    
    document.getElementById('light-box').addEventListener('keypress', function(e) {
        if(e.keyCode === 13 && name.value) {
            $('#light-box').fadeOut(300);
            $('#field').focus();

            document.getElementById('display-name').innerHTML = name.value;
        }
    });
}