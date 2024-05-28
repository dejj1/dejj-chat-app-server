const express = require('express')
const app = express()
const {Server} = require('socket.io')
const http = require('http')
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");

// socket connection
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
})

// online user
const onlineUser = new Set()

io.on('connection', async(socket)=>{
    console.log('connect user', socket.id)
    const token = socket.handshake.auth.token

    // current user details
    const user = await getUserDetailsFromToken(token)
    
    // create a room
    socket.join(user?._id)
    onlineUser.add(user?._id)

    io.emit('onlineUser', Array.from(onlineUser))
    // disconnect
    socket.on('disconnect',()=>{
        onlineUser.delete(user?._id)
        console.log('disconnect user ', socket.id)
    })
})

module.exports = {
    app,
    server
}
