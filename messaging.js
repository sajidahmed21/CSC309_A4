var common = require('./common');
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


/* Sends some data to a given user. Returns true if the user was sent data
 * and false otherwise.
 */
function sendData(partnerId, data) {
    var sentMessage = false;
    
	// send to all sockets where the receiving user is logged in
	for (socketId in socketIO.sockets.sockets) {
		var socket = socketIO.sockets.connected[socketId];
		console.log('socket is for [' + getSessionUserId(socket) + ']');
		if (getSessionUserId(socket) == partnerId) {
			console.log('sending to user [' + partnerId + ']: ');
			console.log(data);
			socket.emit('receive', data);
			
			sentMessage = true;
		}
	}
	
	return sentMessage;
}


/* Returns the userId from the express session or 0 if no user is logged in */
function getSessionUserId(socket) {
    return (socket.handshake && socket.handshake.session && socket.handshake.session.userId) ?
    socket.handshake.session.userId : 0;
}


exports.onConnection = function(socket) {
	console.log('user [' + getSessionUserId(socket) + '] connected');
	
	socket.on('send', function(message) {
	    var userId = getSessionUserId(socket);
	    
		if (userId == 0 ) {
			socket.emit('notLoggedIn');
		}
		else if (userId === message.partnerId)
		{
			socket.emit('error', {message: 'cannot send message to self'});
		}
		else {
			console.log('message [' + message.text + ']');
			console.log('received for user [' + message.partnerId +']');
		    
		    // try to send the message and tell the sender of the status
			var sentMessage = sendData(message.partnerId, {
			    senderId: userId,
			    text: message.text
			});
		    
		    socket.emit(sentMessage ? 'sent' : 'sendError', {messageId: message.messageId});
		}
    });
	
	socket.on('disconnect', function(socket){
		console.log('user [' + getSessionUserId(socket) + '] disconnected');
	});
};


exports.renderPage = function(req, res) {
    res.render('messaging', {
        loggedIn: common.userIsLoggedIn(req)
    });
}