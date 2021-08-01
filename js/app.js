const CLASS_COLLECTION_ITEM = "collection-item";
const ID_COLLECTION = "collection";

const ID_SUPPLIES_QUANTITY = "supplies-quantity";
const ID_DECREASE = "decrease";
const ID_INCREASE = "increase";

const ID_MISSION_CONTROL = "mission-control";
const ID_DISPLAY_PORT = "display-port";

const COLLECTION_ITEMS = Object.freeze(["📻", "🚀", "⛽", "🌐"]);

import { MISSIONS, EMPTY_MISSION } from "./missions.js";

const COLORS = Object.freeze(["r", "o", "y", "g", "b", "i", "v"]);

export default class App {
  static init(...args) {
    return new App(...args);
  }

  constructor() {
    this.renderCollectionItems();
    this.attachEventHandlers();
    this._missions = this.generateMissions();
  }

  get nextMove() {
    return (
      this._missions
        .splice(Math.trunc(Math.random() * this._missions.length), 1)
        .shift() || {
        color: COLORS[Math.trunc(Math.random() * COLORS.length)],
        ...EMPTY_MISSION,
      }
    );
  }

  generateMissions() {
    let moves = [];
    let totalCards = MISSIONS.length * 1.25;
    for (let i = 0; i <= totalCards; i++) {
      moves.push({
        color: COLORS[i % COLORS.length],
        ...(MISSIONS.splice(Math.trunc(Math.random() * MISSIONS.length), 1).shift() ||
          EMPTY_MISSION),
      });
    }
    return moves;
  }

  attachEventHandlers() {
    let suppliesQuantity = document.getElementById(ID_SUPPLIES_QUANTITY);
    document
      .getElementById(ID_DECREASE)
      .addEventListener("click", () => suppliesQuantity.stepDown());
    document
      .getElementById(ID_INCREASE)
      .addEventListener("click", () => suppliesQuantity.stepUp());
    document
      .getElementById(ID_MISSION_CONTROL)
      .addEventListener("click", (e) => this.move(e));
    let collectionItems = document.getElementsByClassName('collection-item');
    for (let i = 0; i < collectionItems.length; i++) {
      collectionItems[i].addEventListener("click", function (e) {
        //this.disabled = true;
        //TODO: display collection message
      });
    }

  }

  move(_e) {
    let move = this.nextMove;
    if (this.animationTimer) {
      clearTimeout(this.animationTimer);
      //place the card at the bottom of the deck
      this._missions.push(move);
    }

    let displayPort = document.getElementById(ID_DISPLAY_PORT);
    displayPort.className = "glass";
    displayPort.innerHTML = "";

    let newDisplay = displayPort.cloneNode(true);
    displayPort.parentElement.replaceChild(newDisplay, displayPort);

    displayPort = newDisplay;

    this.animationTimer = setTimeout(() => {
      let collectPrompt = move.value ? `<p>Collect ${move.value} 🧪</p>` : '';
      displayPort.innerHTML = `<p>${move.text}</p>${collectPrompt}`;
      this.animationTimer = undefined;
    }, 3000);

    displayPort.className = move.color;
  }

  renderCollectionItems() {
    let collectionElement = document.getElementById(ID_COLLECTION);
    collectionElement.innerHTML = COLLECTION_ITEMS.map(
      (item, index) =>
        `
            <input type="checkbox" class="${CLASS_COLLECTION_ITEM}" id="${CLASS_COLLECTION_ITEM}-${index}">
            <label for="${CLASS_COLLECTION_ITEM}-${index}">${item}</label>
        `
    ).join("");
  }
}
