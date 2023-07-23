
const socket = require('socket.io');
const { fetchUsers } = require('../src/controller/user.controller');

const initializeSocket = (server) => {
    const io = socket(server);

    let users = [];

    const addUser = (user, socketId) => {
        let idx = users.findIndex(item => item.user === user)
        if (idx > -1) {
            users[idx].socketId = socketId
        }
        else {
            users.push({ user, socketId });
        }
    };

    const removeUser = (socketId) => {
        users = users.filter((user) => user.socketId !== socketId);
    };

    const getUser = (user) => {
        return users.find((item) => item.user === user);
    };

    io.on('connection', (socket) => {
        console.log('A user connected'); // Log the message when a user connects

        socket.on('addUser', async (user) => {
            addUser(user, socket.id);
            io.emit('getUsers', users);
        });

        socket.on('sendMessage', async (data) => {
            const user = await getUser(data?.receiver);
            if (user) {
                io.to(user.socketId).emit('receiveMessage', data);
            }
        });

        socket.on("updateLocation", async (userInfo) => {
            // let start = Date.now()
            if (userInfo) {
                const user = await getUser(userInfo._id);
                if (user) {
                    if (userInfo?._id && userInfo?.location?.longitude && userInfo?.location?.latitude) {
                        try {
                            let data = await fetchUsers({ _id: userInfo?._id, longitude: userInfo.location.longitude, latitude: userInfo.location.latitude });
                            io.to(user.socketId).emit('receiveData', data);
                        } catch (error) {
                            console.log("fetchUsers err ")
                        }
                    }
                }
            }
            // console.log("CALL TIME ", (Date.now() - start).toFixed(2), "ms")
        })

        socket.on('disconnect', () => {
            removeUser(socket.id);
            io.emit('getUsers', users);
        });
    });

    // Return the io instance
    return io;
};

module.exports = initializeSocket;
