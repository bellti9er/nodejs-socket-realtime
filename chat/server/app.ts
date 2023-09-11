import http from 'http';

import express, { Express } from 'express';
import { Server, Socket   } from 'socket.io';

import Database                         from './database';
import { wrapSocketAsync, CustomError } from './utils/error';
import {
  ChatRoom,
  Message,
  User
} from './models'

export class ChatApp {
  public app        : Express;
  public server     : http.Server;
  public io         : Server;
  private userCount : number = 1;
  private db        : Database

  constructor(db: Database) {
    this.app    = express();
    this.db     = db;
    this.server = http.createServer(this.app);
    this.io     = new Server(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    this.initChatRoom();
  }

  public async initSocket() {
    console.log("Initializing Socket . . .");

    this.io.on('connection', (socket: Socket) => this.handleConnection(socket));
  }

  private async initChatRoom() {
    const newRoomNumber = await ChatRoom.estimatedDocumentCount() + 1;

    await new ChatRoom({ roomNumber: newRoomNumber}).save();

    return newRoomNumber
  }

  private async handleConnection(socket: Socket) {
    const { username, roomNumber } = await this.initNewUser();
    socket.data = { username, roomNumber };

    socket.on('send_message', wrapSocketAsync(socket, (message: string) => this.handleSendMessage(socket, message)));
    socket.on('change_username', wrapSocketAsync(socket, (data: { username: string }) => this.handleChangeUsername(socket, data.username)));
    socket.on('disconnect', wrapSocketAsync(socket, () => this.handleDisconnect(socket)));
  }

  private async initNewUser() {
    const roomNumber = await ChatRoom.estimatedDocumentCount();
    const username   = `Anonymous-${this.userCount++}`;

    this.io.emit('new_connect', username);

    const newUser = new User({ username, roomNumber });

    await newUser.save();

    console.log('New user connected');

    return { username, roomNumber };
  }

  private async handleSendMessage(socket: Socket, message: string) {
    const { username, roomNumber } = socket.data;

    if (!message) throw new CustomError(400, 'Message content is undefined');
    
    const user = await User.findOne({ username, roomNumber });
    
    if(!user) throw new CustomError(404, 'User Not Found');
    
    this.io.emit('receive_message',`${username} : ${message}`);
    
    const newMessage = new Message({
      sender  : username,
      content : message
    });
    
    await newMessage.save();
    
    const chatRoom = await ChatRoom.findOne( { roomNumber });
    
    chatRoom!.messages.push(newMessage._id);
    
    await chatRoom!.save();
  }

  private async handleChangeUsername(socket: Socket, changedUsername: string) {
    const { username, roomNumber } = socket.data;

    const user = await User.findOne({ username, roomNumber });
    
    if(!user) throw new CustomError(404, 'User Not Found');
    
    user.nicknameHistory.push({
      nickname  : changedUsername,
      changedAt : new Date()
    })

    user.username        = changedUsername;
    socket.data.username = changedUsername;
    
    await user.save();

    console.log(`User changed username from ${username} to ${changedUsername}`);
    
    this.io.emit('username_changed', { oldUsername: username, newUsername: changedUsername });
  }

  private async handleDisconnect(socket: Socket) {
    const { username } = socket.data;

    console.log('User disconnected');
    
    this.io.emit('new_disconnect', username);
  }
}
