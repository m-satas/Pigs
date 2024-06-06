export class Player {
    creator: boolean = false;
    id: string = '';
    name: string = '';
    cardsInHand: Card[] = [];
    cardsInFarm: Card[] = [];
    points: number = 0;
    chosenCard: Card = new Card;
    lastCardPlayed: Card = new Card;
    continue: boolean = false;
}

export class Card {
    id: number = 0;
    number: number = 0;
    points: number = 0;
}

export class PlayerState {
    creator: boolean = false;
    id: string = '';    
    name: string = '';
    points: number = 0;
    chosenCard: boolean = false;
    lastCardPlayed: Card = new Card;
    continue: boolean = false;
}

export class GameState {
    cardsOnTable: Card[][] = [];
    playerStates: PlayerState[] = [];
    gamePhase: Phase | null = null;
    waitingForPlayer: string = '';
}

export enum Phase {
    Created = 0,
    Choosing = 1,
    Flip = 2,
    Paused = 3,
    Finished = 4,
    Take = 5
}

export enum ConnectionResponse {
    Connected = 0,
    Full = 1
}

