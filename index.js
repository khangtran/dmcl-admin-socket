const express = require('express');
const axios = require('axios')
const app = express();
const server = require('http').createServer(app);
const users = [];
const io = require('socket.io')(server,{
	cors:{origin:"*"}
});
const router = express.Router()



io.on('connection',function(socket)
{
	socket.on('user_connected',function(user_id,name_user,store,time_login){
		var player = {
		    id: socket.id,
		    user_id: user_id,
		    name_user: name_user,
		    store:store,
		    time_login:time_login,
		};

		users.push(player);
		io.emit('getalluserclient',users);
		console.log(`online ${user_id}`);
	});


	socket.on('getalluser',function(){
		io.emit('getalluserclient',users);
		console.log(`all`);
	});

	socket.on('user_disconnected',function(id_socket){

		io.to(id_socket).emit('disconnect_user',users);
		io.emit('getalluserclient',users);
		console.log(`disconnected ${id_socket}`);
	});

	socket.on('disconnect',function()
	{	

		users.splice(users.findIndex(elem => elem.id === socket.id), 1);
		io.emit('getalluserclient',users);
		console.log("User disconnect");
	});
});

server.listen(3000,() =>{
	console.log('Server is running');
});