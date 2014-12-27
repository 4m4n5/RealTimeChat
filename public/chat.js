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
                document.title = numNewMsg + ' New Raven';
            }
            else{
                document.title = numNewMsg + ' New Ravens';    
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
            for(var x = 0; x < data.length; x += 1){
                oldMsg += '<p class="chat-msg"><strong>' + data[x].name + ': </strong>';
                oldMsg += data[x].message + '</p>';
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
                if (i !== 0 && messages[i].name[messages[i].name.length - 2] != ':') {
					messages[i].name += ': ';
				}
                html += '<p class="chat-msg"><strong>' + (messages[i].name ? messages[i].name : '') + '</strong>';
                html += messages[i].message + '</p>';
            }
            newMsgs.innerHTML = html;
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