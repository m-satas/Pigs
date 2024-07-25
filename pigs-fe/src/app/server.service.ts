import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Card, ConnectionResponse, GameState, Player } from './game-board/game-board.model';
import { PLAYER_COLORS } from './game-board/playerColors';
import { environment } from '../environment/environment';
import seedrandom from 'seedrandom';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  public gameState: GameState = new GameState();
  public player: Player = new Player();
  public playerColorArray: string[] = [...PLAYER_COLORS];
  public playerColors: Map<string, string> = new Map();
  public winningPlayerId: string = '';

  private socket: Socket;

  constructor() {
    this.socket = io(environment.ioUri, environment.ioOptions);

    this.initializeListeners();
  }

  private initializeListeners(): void {
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

  private createObservable<T>(event: string): Observable<T> {
    return new Observable<T>(observer => {
      this.socket.on(event, (data: T) => observer.next(data));
    });
  }

  public listenForGameState(): Observable<GameState> {
    return this.createObservable<GameState>('emitGameState');
  }

  private listenForPlayerState(): Observable<Player> {
    return this.createObservable<Player>('emitPlayerState');
  }

  public listenForGameEnd(): Observable<boolean> {
    return this.createObservable<boolean>('gameEnd');
  }

  private listenForPlayerJoined(): Observable<string> {
    return this.createObservable<string>('playerJoined');
  }

  public async joinGame(roomId: string, playerName: string): Promise<ConnectionResponse> {
    this.playerColorArray = this.randomizeColorArray(roomId);

    return new Promise<ConnectionResponse>(resolve => {
      this.socket.emit('joinGame', roomId.toLowerCase(), playerName, (response: ConnectionResponse) => {
        resolve(response);
      });
    });
  }

  private randomizeColorArray(seed: string): string[] {
    const rng = seedrandom(seed);
    const shuffledArray = [...PLAYER_COLORS];

    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    return shuffledArray;
  }

  private assignColors(): void {
    this.gameState.playerStates.forEach(player => {
      if (!this.playerColors.has(player.id)) {
        this.playerColors.set(player.id, this.playerColorArray[0]);
        this.playerColorArray.push(this.playerColorArray.shift() || '');
      }
    });
  }

  public startGame(clearScores: boolean): void {
    this.socket.emit('startGame', clearScores);
  }

  public selectCard(card: Card): void {
    this.socket.emit('selectCard', card);
  }

  public deselectCard(): void {
    this.socket.emit('deselectCard');
  }

  public takeRow(rowIndex: number): void {
    this.socket.emit('takeRow', rowIndex);
  }

  public leaveGame(): void {
    this.socket.emit('leaveGame');
  }

  public clearData(): void {
    this.gameState = new GameState();
    this.player = new Player();
    this.playerColorArray = [...PLAYER_COLORS];
    this.playerColors.clear();
    this.winningPlayerId = '';
  }
}
