import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { Card, ConnectionResponse, GameState, Player } from './game-board/game-board.model';
import { PLAYER_COLORS } from './game-board/playerColors';
import { environment } from '../environment/environment';
import seedrandom from 'seedrandom';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  public gameState: GameState = new GameState;
  public player: Player = new Player;
  public playerColorArray: string[] = PLAYER_COLORS;
  public playerColors: Map<string, string> = new Map();
  public winningPlayerId: string = '';
  
  private socket = io(environment.ioUri, environment.ioOptions);
  
  constructor() {
    this.listenForGameState().subscribe((gameState: GameState) => {
      this.gameState = gameState;
    });

    this.listenForPlayerState().subscribe((playerState: Player) => {
      this.player = playerState;
    });

    this.listenForPlayerJoined().subscribe(() => {
      this.assignColors();
    });
  }
  
  private assignColors() {
    for (let player of this.gameState.playerStates) {
      if (!this.playerColors.has(player.id)) {
        this.playerColors.set(player.id, this.playerColorArray[0]);
        this.playerColorArray.push(this.playerColorArray.shift() || '');
      }
    }
  }

  public listenForGameState(): Observable<GameState> {
    let observable = new Observable<GameState>(observer => {
      this.socket.on('emitGameState', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  private listenForPlayerState(): Observable<Player> {
    let observable = new Observable<Player>(observer => {
      this.socket.on('emitPlayerState', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  public listenForGameEnd(): Observable<boolean> {
    let observable = new Observable<boolean>(observer => {
      this.socket.on('gameEnd', () => {
        observer.next();
      });
    });
    return observable;
  }

  private listenForPlayerJoined(): Observable<string> {
    let observable = new Observable<string>(observer => {
      this.socket.on('playerJoined', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  async joinGame(roomId: string, playerName: string): Promise<ConnectionResponse> {

    this.playerColorArray = this.randomizeColorArray(roomId);

    return new Promise((resolve) => {
      this.socket.emit('joinGame', roomId.toLowerCase(), playerName, (response: any) => {
        resolve(response);
      });
    });
  }
  
  private randomizeColorArray(seed: string) {
    const rng = seedrandom(seed);
    const shuffledArray = [...PLAYER_COLORS];

    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    
    return shuffledArray;
  }

  public startGame(clearScores: boolean) {
    this.socket.emit('startGame', clearScores);
  }

  public selectCard(card: Card) {
    this.socket.emit('selectCard', card);
  }

  public deselectCard() {
    this.socket.emit('deselectCard');
  }

  public takeRow(rowIndex: number) {
    this.socket.emit('takeRow', rowIndex);
  }

  public leaveGame() {
    this.socket.emit('leaveGame');
  }

  public clearData() {
    this.gameState = new GameState;
    this.player = new Player;
    this.playerColorArray = PLAYER_COLORS;
    this.playerColors = new Map();
    this.winningPlayerId = '';
  }
}
