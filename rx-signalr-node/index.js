var express = require('express');
var SignalRJS = require('signalrjs');
 
var signalR = SignalRJS();

signalR.hub('chatHub',{
    send : function(userName, message, ts){
        this.clients.all.invoke('broadcast').withArgs([userName, message, ts])
        console.log(userName + ': ' + message + ' at ' + ts);
    }
});
 
var server = express();
server.use(signalR.createListener())
server.use(express.static(__dirname));
server.listen(3000);
 
console.log('server.listen(3000);');

signalR.on('CONNECTED',function(){
    console.log('connected');
    setInterval(function () {
        // signalR.send({time:new Date()});
    },1000)
});