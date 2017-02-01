var express = require('express');
var SignalRJS = require('signalrjs');
 
var signalR = SignalRJS();
 
var server = express();
server.use(signalR.createListener())
server.use(express.static(__dirname));
server.listen(3000);
 
 console.log('Up and running...');

signalR.on('CONNECTED',function(){
    console.log('connected');
    setInterval(function () {
        signalR.send({time:new Date()});
    },1000)
});