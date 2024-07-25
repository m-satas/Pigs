import express from 'express';
import { createServer } from 'node:http';
import { GameServer } from './GameServer/GameServer.js'
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);
const gameServer = new GameServer(server);

const HOST = process.env.SERVER_HOST || 'localhost';
const PORT = process.env.SERVER_PORT || 3000;

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});