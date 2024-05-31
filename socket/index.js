const express = require('express')
const app = express()
const {Server} = require('socket.io')
const http = require('http')
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require('../models/userModel');
const { ConversationModel, MessageModel } = require('../models/conversationModel');
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
    onlineUser.add(user?._id?.toString())

    io.emit('onlineUser', Array.from(onlineUser))

    socket.on('message-page', async (userId)=>{
        console.log('userId', userId)
        const userDetails = await UserModel.findById(userId).select('-password')

        const payload = {
            _id: userDetails?._id,
            name: userDetails?.name,
            email: userDetails?.email,
            profile_pic: userDetails?.profile_pic,
            online: onlineUser.has(userId)
        }

        socket.emit('message-user', payload)
    })

    // new message
    socket.on('new message', async (data)=>{
        // check if conversation btw both users is available
        let conversation = await ConversationModel.findOne({
            "$or": [
                {sender: data?.sender, receiver: data?.receiver},
                {sender: data?.receiver, receiver: data?.sender}
            ]
        })

        if(!conversation){
            const createConversation = await ConversationModel({
                sender: data?.sender,
                receiver: data?.receiver
            })
            conversation = await createConversation.save()
        }
        const message = new MessageModel({
            text: data.text,
            imageUrl: data.imageUrl,
            videoUrl: data.videoUrl,
            
        })
        const saveMessage = await message.save()
        const updateConversation = await ConversationModel.updateOne({_id: conversation?._id},{
            "$push": {messages: saveMessage?._id}
        })
        console.log('new message', data)
    })
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
