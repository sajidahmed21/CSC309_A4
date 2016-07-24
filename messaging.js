var common = require('./common');
var socketIO = global.socketIO;


/* Returns an array of all sockets that belong to a given user. */
function getUserSockets(userId) {
    var sockets = []
    
    for (socketId in socketIO.sockets.connected) {
        var socket = socketIO.sockets.connected[socketId];
        
        if (getSessionUserId(socket) == userId) {
            sockets.push(socket);
        }
    }
    return sockets;
}


/* Returns true if the given user is online (logged in and has an active socket
 * for messaging.
 */
exports.userIsOnline = function(userId) {
	return getUserSockets(userId).length > 0;
};


/* Sends some data to a given user. Returns true if the user was sent data
 * and false otherwise.
 */
function sendData(partnerId, data) {
    var sockets = getUserSockets(partnerId);
    
    // if the user isn't online, return false
    if (sockets.length === 0) {
        return false;
    }
    
    console.log('sending to user [' + partnerId + ']: ');
	console.log(data);
    
	// otherwise send the message to each of those sockets
	sockets.forEach(function(socket) {
		socket.emit('receive', data);
	});
	
	return true;
}


/* Returns the userId from the express session or 0 if no user is logged in */
function getSessionUserId(socket) {
    return (socket.handshake && socket.handshake.session && socket.handshake.session.userId) ?
    socket.handshake.session.userId : 0;
}


/* To be called when the client-side socket.io code attempts to connect. */
exports.onConnection = function(socket) {
	console.log('user [' + getSessionUserId(socket) + '] connected');
	
	if (getSessionUserId(socket) === 0) {
        console.log('prevented attempt to send message without being logged in');
		socket.emit('notLoggedIn');
		socket.disconnect();
    }
	
	// if this is the user's first open socket
	if (getUserSockets(getSessionUserId(socket)).length === 1) {
        // notify all sockets of the user's status change
        socketIO.sockets.emit('status', {
            type: 'user-online',
            userId: getSessionUserId(socket)
        });
    }
	
	socket.on('send', function(message) {
	    var userId = getSessionUserId(socket);
	    
		if (userId === 0 ) {
		    console.log('prevented attempt to send message without being logged in');
			socket.emit('notLoggedIn');
			socket.disconnect();
			console.log(getUserSockets(getSessionUserId(socket)));
		}
		else if (userId == message.partnerId) {
		    console.log('prevented attempt to send message to self');
			socket.emit('failure', {message: 'cannot send message to self'});
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
	    var userId = getSessionUserId(socket);
		console.log('user [' + userId + '] disconnected');
		
		// check to make sure that the user has no other sockets open
		if (getUserSockets(userId).length === 0) {
	        // notify all sockets of the user's status change
	        socketIO.sockets.emit('status', {
	            type: 'user-offline',
	            userId: userId
            });
	    }
	});
};


/* Renders the messaging page. */
exports.renderPage = function(req, res) {
    res.render('messaging', {
        loggedIn: common.userIsLoggedIn(req)
    });
}