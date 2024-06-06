import { Server } from 'socket.io';
import { Game } from './Game.js';
import { GameOptions } from './GameOptions.js';
import { ServerResponses } from './ServerResponses.js';

export class GameServer {

  games = new Map();

  constructor(server){
    this.server = server;
    this.io = new Server(server,{
      cors: {
        origin: "*"
      }
    });

    this.initializeSocketEvents(this.io);    
  }

  initializeSocketEvents(io) {
    io.on('connection', (socket) => {
  
      socket.on('joinGame', (roomId, playerName, response) => {
        const game = this.joinGame(roomId, playerName, socket, response);
        setupGameListeners(game, roomId);
      });
        
      const setupGameListeners = (game, roomId) => {
        const handlers = {};
  
        handlers.startGame = (clearScores) => {
          game.startGame(socket.id, clearScores);
        };
  
        handlers.selectCard = (card) => {
          game.selectCard(socket.id, card);
        };
  
        handlers.deselectCard = () => {
          game.deselectCard(socket.id);
        };
  
        handlers.takeRow = (rowIndex) => {
          game.playerTakesRow(socket.id, rowIndex);
        };
  
        handlers.leaveGame = () => {
          cleanupListeners();
          this.leaveGame(roomId, socket);
        };
  
        handlers.disconnect = () => {
          cleanupListeners();
          this.leaveGame(roomId, socket);
        };
  
        const cleanupListeners = () => {
          socket.off('startGame', handlers.startGame);
          socket.off('selectCard', handlers.selectCard);
          socket.off('deselectCard', handlers.deselectCard);
          socket.off('takeRow', handlers.takeRow);
          socket.off('leaveGame', handlers.leaveGame);
          socket.off('disconnect', handlers.disconnect);
        };
  
        socket.on('startGame', handlers.startGame);
        socket.on('selectCard', handlers.selectCard);
        socket.on('deselectCard', handlers.deselectCard);
        socket.on('takeRow', handlers.takeRow);
        socket.on('leaveGame', handlers.leaveGame);
        socket.on('disconnect', handlers.disconnect);
      };

    });
  }

  joinGame(roomId, playerName, socket, response) {
    const game = this.getOrCreateGame(roomId);

    if (game.playerList.size === GameOptions.playerLimit) {
      response(ServerResponses.Full);
      return;
    }

    response(ServerResponses.Connected);
    
    socket.join(roomId);

    game.addPlayer(socket.id, playerName);

    return game;
  }

  getOrCreateGame(roomId) {
    if (!this.games.has(roomId)) {
      this.games.set(roomId, new Game(roomId, this.io));
    }
    return this.games.get(roomId);
  }

  leaveGame(roomId, socket) {

    const game = this.games.get(roomId);
  
    if (!game) {
      return;
    }
  
    socket.leave(roomId);
    game.removePlayer(socket.id);
  
    if (game.playerList.size === 0) {
      this.games.delete(roomId);
    }
  }
}