import 'dotenv/config';

import express from 'express';
import morgan  from 'morgan';
import cors    from 'cors';

import { ChatApp      } from './app';
import Database         from './database';

const startServer = async() => {
  const port     : number   = (process.env.PORT! || 8080) as number
  const database : Database = new Database(process.env.MONGO_URI!)

  await database.connect();

  const chatApp: ChatApp = new ChatApp(database);

  chatApp.app.use(morgan('dev'));
  chatApp.app.use(cors());
  chatApp.app.use(express.json());

  chatApp.server.listen(port, () => {
    chatApp.initSocket();

    console.log(`🚀🚀🚀 Server Listening on port ${port} 🚀🚀🚀`)
  })
}

startServer();
