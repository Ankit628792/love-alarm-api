const server = require('../bin/www');
const socket = require('socket.io');

const io = socket(server);

let users = []
const addUser = (user, socketId) => {
    !users.some((item) => item.user === user) &&
        users.push({ user, socketId })
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId)
}

const getUser = (user) => {
    return users.find(item => item.user === user)
}

// when connect 
io.on('connection', (socket) => {
    console.log('a user connected')
    //take userId and socketId
    socket.on('addUser', async (user) => {
        await addUser(user, socket.id);
        io.emit('getUsers', users)
    })

    //send and get message
    socket.on('sendMessage', async ({ sender, receiver, text }) => {
        const user = await getUser(receiver)
        if (user) {
            io.to(user.socketId).emit('getMessage', {
                sender, text
            })
        }
    })

    // when disconnect
    socket.on('disconnect', () => {
        removeUser(socket.id)
        io.emit('getUsers', users)
    })
})

module.exports = io