import http from 'http';

import express, { Express } from 'express';
import { Server, Socket   } from 'socket.io';

import { wrapSocketAsync, CustomError } from './utils/error';
import {
  ChatRoom,
  Message,
  User
} from './models'

export class ChatApp {
  public app    : Express;
  public server : http.Server;
  public io     : Server;

  constructor() {
    this.app    = express();
    this.server = http.createServer(this.app);
    this.io     = new Server(this.server, {
      cors: {
        origin: process.env.ALLOWED_HOSTS?.split(',') || "*",
        methods: ["GET", "POST"]
      }
    });
    this.initChatRoom();
  }

  public initSocket() {
    console.log("Initializing Socket . . .");

    let userCount = 1;

    this.io.on('connection', async (socket: Socket) => {
      console.log('New user connected');

      const roomNumber = await ChatRoom.estimatedDocumentCount();
      let   username   = `Anonymous-${userCount++}`;

      // Notify new connection
      this.io.emit('new_connect', username);

      const newUser = new User({ username, roomNumber });

      await newUser.save();

      // Handle username change
      socket.on('change_username', wrapSocketAsync(socket, async (data: { username: string }) => {
        console.log(`User changed username from ${username} to ${data.username}`);

        const user = await User.findOne({ username });

        if(!user) throw new CustomError(404, 'User Not Found');

        user.username = data.username;
        user.nicknameHistory.push({
          nickname  : data.username,
          changedAt : new Date()
        })

        await user.save();

        this.io.emit('username_changed', data.username);
      }));

      // Handle user disconnect
      socket.on('disconnect', () => {
        console.log('User disconnected');

        this.io.emit('new_disconnect', username);
      });

      // Handle message send
      socket.on('send_message', wrapSocketAsync(socket, async (message: string) => {
        if (!message) throw new CustomError(400, 'Message content is undefined');

        const user = await User.findOne({ username, roomNumber });
        
        if(!user) throw new CustomError(404, 'User Not Found');

        this.io.emit('receive_message',`${username} : ${message}`);

        const newMessage = new Message({
          sender  : username,
          content : message
        });

        await newMessage.save();

        let chatRoom = await ChatRoom.findOne( { roomNumber });

        if (!chatRoom) {
          chatRoom = new ChatRoom({ roomNumber });
          await chatRoom.save();
        }

        chatRoom.messages.push(newMessage._id);

        await chatRoom.save();
      }));
    });
  }

  private async initChatRoom() {
    const newRoomNumber = await ChatRoom.estimatedDocumentCount() + 1;
    
    new ChatRoom({ roomNumber: newRoomNumber }).save();
  }
}
