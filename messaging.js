var socketIO = global.socketIO;


/* Closes any sockets found with a matching sessionId.
 * Should be called when a user logs out.
 */
exports.invalidateSession = function(sessionId) {
	for (socketId in socketIO.sockets.sockets) {
		var socket = socketIO.sockets.connected[socketId];
		if (socket.sessionId === sessionId) {
			socket.close();
		}
	}
};


function sendData(receiverId, data) {
	// send to all sockets where the receiving user is logged in
	for (socketId in socketIO.sockets.sockets) {
		var socket = socketIO.sockets.connected[socketId];
		if (socket.userId === receiverId) {
			console.log('sending to user [' + receiverId + ']: ');
			console.log(data);
			socket.emit('receive', data);
		}
	}
}


exports.onConnection = function(socket) {
	// todo: using the provided sessionId, get the userId;
	// if the userId is invalid (no one is logged in, reject the socket)
	// once done, remove check for userid below
	socket.userId = Math.floor(Math.random() * 10);
	socket.sessionId = 0;
	
	console.log('user [' + socket.userId + '] connected');
	
	socket.on('send', function(message) {
		if (!socket.userId) {
			sendData(socket.userId, {'error': 'not logged in'});
		}
		else if (socket.userId == message.receiverId)
		{
			sendData(socket.userId, {'error': 'cannot send message to self'});
		}
		else {
			console.log('message [' + message.text + ']');
			console.log('received for user [' + message.receiverId +']');
		
			sendData(message.receiverId, {text: message.text});
		}
    });
	
	socket.on('disconnect', function(){
		console.log('user [' + socket.userId + '] disconnected');
	});
};