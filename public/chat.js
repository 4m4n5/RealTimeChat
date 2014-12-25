window.onload = function() {
 
    var messages = [];
    var serverBaseUrl = document.domain;
    var socket = io.connect(serverBaseUrl);
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    var name = document.getElementById("name");
    var numDisp = document.getElementById("numDisp");
    
    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data);
            var html = '<p class="chat-msg">';
            for(var i=0; i<messages.length; i++) {
                html += '<strong>' + (messages[i].username ? messages[i].username : 'Three-Eyed Raven') + ': </strong>';
                html += messages[i].message + '</p>';
            }
            content.innerHTML = html;
            content.scrollTop = content.scrollHeight;
        } else {
            console.log("We have a situation: ", data);
        }
    });
    
    socket.on('userNum', function (data) {
        numDisp.innerHTML = data.userNum;
    });
    
    
    //jQuery for listening to enter keypress
    $(document).ready(function() {
        $("#field").keyup(function(e) {
            if(e.keyCode == 13) {
                sendMessage();
            }
        });
    });
 
    sendButton.onclick = sendMessage = function() {
        if(name.value == ""){
            alert("Please type your name, douchebag!");
        }
        else {
            var text = field.value;
            socket.emit('send', { message: text, username: name.value });
            field.value = "";
        }
    };
 
}