import { Cards } from "./Cards.js";
import { GamePhase } from "./GamePhase.js"
import { GameOptions } from "./GameOptions.js";

export class Game {

  constructor(roomId, server) {
    this.server = server;
    this.roomId = roomId;
    this.playerList = new Map();
    this.gamePhase = GamePhase.Created;
    this.cardSubsets = [];    		      // 10 arrays of 10 cards and 1 of 4
    this.cardsOnTable = [];
    this.waitingForPlayer = '';         // playerId that is to take an action (e.g. select row to take)
  }
  
  startGame(playerId, clearScores) {
    if (this.isGameInProgress() || !this.playerList.get(playerId).creator) {
      return;
    }

    this.cardSubsets = this.splitToSubsets(this.shuffleCards([...Cards]), GameOptions.cardSubsetSize);
    this.assignCards();
    this.dealTableCards();
    this.gamePhase = GamePhase.Choosing;
    
    if (clearScores) {
      this.clearScores();
    }
    
    this.emitGameState();
    this.server.to(this.roomId).emit('gameStarted', true);
  }
  
  isGameInProgress() {
    return this.gamePhase !== GamePhase.Created && this.gamePhase !== GamePhase.Finished;
  }
  
  splitToSubsets(cardArray, subsetSize) {
    const subsets = [];
    for (let i = 0; i < cardArray.length; i += subsetSize) {
      subsets.push(cardArray.slice(i, i + subsetSize).sort((a,b) => a.number - b.number));
    }
    return subsets;
  }
  
  shuffleCards(cardArray) {
    for (let i = cardArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardArray[i], cardArray[j]] = [cardArray[j], cardArray[i]];
    }
    return cardArray;
  }
  
  assignCards() {
    this.playerList.forEach(player => {
      player.cardsInHand = this.cardSubsets.shift();
    });
  }
  
  dealTableCards() {
    this.cardsOnTable = [];

    for (let i = 0; i < GameOptions.cardRowCount; i++) {
      this.cardsOnTable.push([this.cardSubsets[this.cardSubsets.length - 1][i]]);
    }
  }
  
  clearScores() {
    this.playerList.forEach(player => {
      player.points = 0;
    });
  }
  
  emitGameState() {
    this.emitPersonalPlayerStates();

    this.server.to(this.roomId).emit('emitGameState', {
      cardsOnTable: this.cardsOnTable,
      playerStates: this.formPublicPlayerStates(),
      gamePhase: this.gamePhase,
      waitingForPlayer: this.waitingForPlayer
    });
  }
  
  emitPersonalPlayerStates() {
    this.playerList.forEach((player) => {
      this.server.to(player.id).emit('emitPlayerState', player);
    });
  }

  formPublicPlayerStates() {
    const playerStates = [];
    this.playerList.forEach((player) => {
      playerStates.push({
        creator: player.creator,
        id: player.id,
        name: player.name,
        numOfCardsInHand: player.cardsInhand.length,
        numOfCardsInFarm: player.cardsInFarm.length,
        points: player.points,
        chosenCard: player.chosenCard ? true : false,
        lastCardPlayed: player.lastCardPlayed,
        continue: player.continue
      })
    });

    return playerStates;
  }

  selectCard(playerId, card) {
    if (this.gamePhase !== GamePhase.Choosing) {
      return;
    }

    if (!this.playerHasCard(playerId, card)) {
      return;
    }
    
    this.playerList.get(playerId).chosenCard = card;

    this.emitGameState();

    this.checkForFlip();
  }

  playerHasCard(playerId, card) {
    return this.playerList.get(playerId).cardsInHand.some(plCard => plCard.number === card.number);
  }

  checkForFlip() {
    if (this.hasEveryPlayerChosen() && this.isGameInProgress()) {
      this.flipCards();
    }
  }
  
  hasEveryPlayerChosen() {
    return Array.from(this.playerList.values())
      .filter(player => this.hasCardsInHand(player))
      .every(player => !!player.chosenCard);
  }

  hasCardsInHand(player) {
    return player.cardsInHand && player.cardsInHand.length > 0;
  }
 
  deselectCard(playerId) {
    if (this.gamePhase !== GamePhase.Choosing) {
      return;
    }

    this.playerList.get(playerId).chosenCard = null;
    this.emitGameState();
  }

  flipCards() {

    this.gamePhase = GamePhase.Flip;

    const cardsChosen = this.sortedChosenCardArray();

    for (let card of cardsChosen) {

      const sortedTableCards = this.sortedLastTableCards();
      const targetCardRowIndex = this.findTargetCardRowIndex(card, sortedTableCards);

      // Card lower than last cards in all rows
      if (targetCardRowIndex === -1) {
        this.setPlayerToTakeRow(card.playerId);
        return;
      }
      
      // Picked row is full
      if (this.cardsOnTable[targetCardRowIndex].length === GameOptions.cardRowLimit) {
        this.allocatePoints(card.playerId, this.cardsOnTable[targetCardRowIndex]);
        this.cardsOnTable[targetCardRowIndex] = [];
      }

      this.cardsOnTable[targetCardRowIndex].push(card);
      this.updateHand(card.playerId);
    }

    if (this.allPlayersOutOfCards()) {
      this.gamePhase = GamePhase.Finished;
      this.server.to(this.roomId).emit('gameEnd');
    } else {
      this.gamePhase = GamePhase.Choosing;
    }

    this.emitGameState();
  }

  sortedChosenCardArray() {
    const cardsChosen = [];

    this.playerList.forEach(player => {

      if(player.chosenCard !== null) {
        cardsChosen.push({
          ...player.chosenCard,
          playerId: player.id
        });
      }

    });

    return cardsChosen.sort((a, b) => a.number - b.number);
  }
  
  sortedLastTableCards() {
    let cards = [];

    for (let i = 0; i < this.cardsOnTable.length; i++) {
      cards.push({
        number: this.cardsOnTable[i][this.cardsOnTable[i].length-1].number,
        index: i
      });
    }

    return cards.sort((a, b) => a.number - b.number);
  }

  findTargetCardRowIndex(card, sortedTableCards) {
    let targetCardRowIndex = -1;

    // Card is larger then largest last card on any row
    if (card.number > sortedTableCards[sortedTableCards.length - 1].number) {

      targetCardRowIndex = sortedTableCards[sortedTableCards.length - 1].index;

    } else {

      for (let i = 0; i < sortedTableCards.length; i++) {
        if (card.number < sortedTableCards[i].number) {
          targetCardRowIndex = sortedTableCards[i - 1] ? sortedTableCards[i - 1].index : -1;
          break;
        }
      }
    }

    return targetCardRowIndex;
  }

  setPlayerToTakeRow(playerId) {
    this.gamePhase = GamePhase.Take;
    this.waitingForPlayer = playerId;

    this.emitGameState();
  }
  
  allocatePoints(playerId, cardRow) {
    let totalRowPoints = 0;
    cardRow.forEach(card => {
      totalRowPoints += card.points;
    })

    let player = this.playerList.get(playerId);

    player.cardsInFarm = [ ...player.cardsInFarm, ...cardRow];
    player.points += totalRowPoints;
  }
  
  updateHand(playerId) {
    let player = this.playerList.get(playerId);
    player.lastCardPlayed = player.chosenCard;
    player.cardsInHand = player.cardsInHand.filter(card => card.number !== player.chosenCard.number);
    player.chosenCard = null;
  }

  allPlayersOutOfCards() {
    return [...this.playerList.values()].every(player => player.cardsInHand === undefined || player.cardsInHand.length === 0);
  }

  playerTakesRow(playerId, rowIndex) {
    if (this.gamePhase !== GamePhase.Take || this.waitingForPlayer !== playerId) { return; }

    this.allocatePoints(playerId, this.cardsOnTable[rowIndex]);

    this.cardsOnTable[rowIndex] = [this.playerList.get(playerId).chosenCard];
    
    this.updateHand(playerId);

    this.waitingForPlayer = '';

    this.emitGameState();
    
    this.flipCards();
  }

  addPlayer(playerId, playerName) {
    this.playerList.set(playerId, {
      creator: this.playerList.size === 0 ? true : false,
      id: playerId,
      name: playerName,
      cardsInhand: [],
      cardsInFarm: [],
      points: 0,
      chosenCard: null,
      lastCardPlayed: null,
      continue: false
    });

    this.emitGameState();

    this.server.to(this.roomId).emit('playerJoined', playerId);
  }

  removePlayer(playerId) {
    
    const player = this.playerList.get(playerId);
    if (!player) { return; }

    this.playerList.delete(playerId);

    if (player.creator && this.playerList.size !== 0) {
      this.passCreatorStatus();
    }

    this.emitGameState();

    this.checkForFlip();
  }

  passCreatorStatus() {
    const [firstKey, playerInfo] = this.playerList.entries().next().value;
    playerInfo.creator = true;
    this.playerList.set(firstKey, playerInfo);
  }
}

