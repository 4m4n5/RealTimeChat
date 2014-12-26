window.onload = function() {
 
    var messages = [];
    var serverBaseUrl = document.domain;
    var socket = io.connect(serverBaseUrl);
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    var name = document.getElementById("name");
    var numDisp = document.getElementById("numDisp");
    
    socket.on('output', function(data){
        if(data.length){
//            var prevMessage = '';
//            for(var x = 0; x < data.length; x += 1){
//                prevMessage += '<p class="chat-msg"><strong>' + data[x].name + ': </strong>';
//                prevMessage += data[x].message + '</p>';
//            }
//            content.innerHTML = prevMessage;
            messages.push(data);
        }
    });
   
    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += '<p class="chat-msg"><strong>' + (messages[i].name ? messages[i].name : 'Three-Eyed Raven') + ': </strong>';
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
            socket.emit('send', { message: text, name: name.value });
            field.value = "";
        }
    };
 
}