const express = require('express');
const axios = require('axios')
const app = express();
const server = require('http').createServer(app);
const users = [];
const io = require('socket.io')(server, {
	cors: { origin: "*" }
});
const router = express.Router();
const PORT = 3000;


io.on('connection', function (socket) {

	console.log('socket.connected', socket.id);

	socket.on('user_connected', function (user_id, name_user, store, time_login) {
		var player = {
			id: socket.id,
			user_id: user_id,
			name_user: name_user,
			store: store,
			time_login: time_login,
		};

		users.push(player);
		io.emit('getalluserclient', users);
		console.log(`user.online ${user_id}`, player);
	});

	socket.on('getalluser', function () {
		io.emit('getalluserclient', users);
		console.log(`user.all`, users.length);
	});

	socket.on('user_disconnected', function (id_socket) {

		io.to(id_socket).emit('disconnect_user', users);
		io.emit('getalluserclient', users);
		console.log(`disconnected ${id_socket}`);
	});

	socket.on('user_kick', function (id_socket) {
		io.to(id_socket).emit('disconnect_user', users);
		io.emit('getalluserclient', users);
		console.log(`user.kick disconnected ${id_socket}`);
	});

	socket.on('user_ban', function (id_socket) {
		io.to(id_socket).emit('disconnect_user', users);
		io.emit('getalluserclient', users);
		console.log(`user.ban disconnected ${id_socket}`);
	});

	socket.on('send-noti', function (data) {
		var { toId, fromId, message, title, level, group, } = data;
		io.emit('send-noti');
	});

	socket.on('disconnect', function () {
		var index = users.findIndex(elem => elem.id === socket.id);
		if (index != -1)
			users.splice(index, 1);

		io.emit('getalluserclient', users);
		console.log("User disconnect");
	});
});

server.listen(PORT, () => {
	console.log(`Server is running ${PORT}`);
});