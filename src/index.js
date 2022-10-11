/*---------------Global variables-------------*/
const main = document.querySelector('main');
const p = document.querySelector('p');
const div = document.querySelector('div');
const startBtn = document.querySelector('button');
const ul = document.createElement('ul');

ul.setAttribute('class','damagedShipList');

let botMovesMemo = {};
let initialHit = null;

/*----------------Board class----------------*/
class Board {
  constructor(col, row) {
    this.col = col;
    this.row = row;
    this.fleet = [
      ['0-0'],
      ['0-0','0-1'],
      ['0-0','0-1','0-2'],
      ['0-0','0-1','0-2','0-3'],
      ['0-0','0-1','0-2','0-3','0-4'],
      ['0-0','0-1','0-2','0-3','0-4','0-5'],
    ];
  }

  // creating table
  displayBoard() {
    const table = document.createElement('table');
    for(let i = 0; i < this.col; i++) {
      const tr = document.createElement('tr');
      for(let j = 0; j < this.row; j++) {
        const cell = document.createElement('td');
        cell.setAttribute('class', `${i}-${j}`);
        cell.setAttribute('draggable', true);
        tr.append(cell);
      }
      table.append(tr);
    }
    main.append(table);
  }

  // put random ships on the tables
  setShips(cells, shipsLocation) {
    let memo = {};
    let p = 0;
    while(p < this.fleet.length) {
      let randomCells = [];
      let length = this.fleet[p].length - 1;
      let random = Math.floor(Math.random() * 99);
      let isExisting = false;
      if(10-random % 10 > length) {
        // checking for collision in this while loop first
        let i = 0;
        while (i <= length) {
          if(memo[random + i]) { 
            isExisting = true;
            break;
          } else { 
            memo[random+i] = true;
            i++;
          }
        } 
        // if there is no collision for the entire ship (p), it'll then be placed on the table   
        if (!isExisting) {
          while(length >= 0) {
            if (botTable)
            cells[random + length].textContent = '1';
            if (cells === botCells) {
              cells[random + length].textContent = '';
            }
            cells[random + length].classList.add('ship');
            randomCells.push(random + length);
            length--;
          }
          shipsLocation.push(randomCells);
          p++;
        }
      }
    }
  }
}

/*------------------Players class---------------*/
class Players {
  constructor(player) {
    this.player = player;
    this.shipsCount = 6;
    this.shipsLocation = [];
    this.damagedShips = {};
    this.win = false;
    this.turn = true;
  }

  // My AI 
  botTurn() {
    // I have to prevent clicking on botBoard in this 500 seconds!
    // I have to prevent double click(probably debounce function)
    // AI missing one turn: 
    // - if firstHit is leftmost cell in ship. it'll check left anyway does not know size of ship
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    if (initialHit === null) {
      let random = null;
      // finding new random cells, ignoring repeat cells/randoms
      while(true) {
        random = Math.floor(Math.random() * 99);
        if(!botMovesMemo[random]) break;
      }
      if (playerCells[random].classList[1] === 'ship') {
        let p = 0;
        async function myLoop() {
          while (playerCells[random + p].classList[1] === 'ship' && !botMovesMemo[random + p]) {
            playerCells[random + p].style.backgroundColor = 'red';
            player.winCheck(playerCells[random + p]);
            if (player.shipsCount === 0) {
              let ul = document.querySelector('ul');
              ul.style.display = 'none';
              const winStatus = document.createElement('p');
              winStatus.setAttribute('class', 'win-status');
              winStatus.textContent = 'Your army is defeated. Better luck next time.';
              div.append(winStatus);
            }
            botMovesMemo[random + p] = true;
            p++;
            if ((random + p) % 10 === 0) {
              break;
            }
            await sleep(500);
          }
          initialHit = random;
          if ((random + p) % 10 === 0 || botMovesMemo[random + p]) {
            setTimeout(() => {
              bot.botTurn();
            }, 500);
            return;
          }
    
          //if ((random+p) % 10 === 0) myLoop2();
          if ((random + p) % 10 !== 0) {
            playerCells[random + p].textContent = '×';
            botMovesMemo[random + p] = true;
          } 
        }
        myLoop();

      } else {
          playerCells[random].textContent = '×';
          botMovesMemo[random] = true;
        }
    // if initialHit !== null. it means go check the left side of inititalHit
    } else {
      let p = 1;
      async function myLoop2() {
        while (playerCells[initialHit - p].classList[1] === 'ship' && !botMovesMemo[initialHit - p]) {
          if ((initialHit - p) % 10 === 9) {
            break;
          }
          playerCells[initialHit - p].style.backgroundColor = 'red';
          player.winCheck(playerCells[initialHit - p]);
          botMovesMemo[initialHit - p] = true;
          p++;
          await sleep(500);
        }
        if (botMovesMemo[initialHit - p]){
          initialHit = null;
          bot.botTurn();
          return;
        }
        if ((initialHit - p) % 10 !== 9) {
          playerCells[initialHit - p].textContent = '×';
          botMovesMemo[initialHit - p] = true;
          initialHit = null;
        }
        else {
          initialHit = null;
          bot.botTurn ();
          return;
        }
      } 
      myLoop2();
    }
  }
    
  playerTurn() {
    // prevent clicking more than once on each cell(debounce)
    // prevent clicking when bot's playing
    
    //prevent playing the game after win
    /*if (!player.turn || player.win) {
      botTable.removeEventListener('click', botTableClickHandler, { capture: true });
    }
    */

    botTable.addEventListener('click', botTableClickHandler, { capture: true });

    function botTableClickHandler(e) {
      if (e.target.matches('td.ship')) {
        // these should be changed with win() method
        for(const ship of bot.shipsLocation) {
          for (let i = 0; i < ship.length; i++) {
            if (Number(e.target.className.split(' ')[0].split('-').join('')) === ship[i]) {
              bot.damagedShips[ship.length] = !bot.damagedShips[ship.length] ?  1 : bot.damagedShips[ship.length]+1;
              if (bot.damagedShips[ship.length] === ship.length) {
                bot.shipsCount--;
                let ul = document.querySelectorAll('.damagedShipList > li');
                for (let i = 0; i < ul.length; i++) {
                  if (ship.length === ul[i].childNodes.length) {
                    let divs = ul[i].childNodes;
                    for (let j = 0; j < divs.length; j++) {
                      divs[j].style.backgroundColor = `rgba(${0},${0},${0},${.4})`;
                    }
                  }
                }
                break;
              } 
            }
          }
        }
        if (bot.shipsCount === 0) {
          botTable.removeEventListener('click', botTableClickHandler, { capture: true });
          let ul = document.querySelector('ul');
          ul.style.display = 'none';
          const winStatus = document.createElement('p');
          winStatus.setAttribute('class', 'win-status');
          //design: add css style that is typing victory...   
          winStatus.textContent = 'Victory! Your enemy is destroyed.';
          div.append(winStatus);

        }
        e.target.style.backgroundColor = 'red';
      } else {
        player.turn = !player.turn;
        e.target.textContent = '×';
        setTimeout(() => {
          bot.botTurn();
        }, 500)
      }
    };
  }

  winCheck(target) {
    for(const ship of this.shipsLocation) {
      for (let i = 0; i < ship.length; i++) {
        if (Number(target.className.split(' ')[0].split('-').join('')) === ship[i]) {
          this.damagedShips[ship.length] = !this.damagedShips[ship.length] ?  1 : this.damagedShips[ship.length]+1;
          if (this.damagedShips[ship.length] === ship.length) {
            this.shipsCount--;
            break;
          } 
        }
      }
    } 
  }
}

/*---------------making classes instances------------*/
const player = new Players('player');
const bot = new Players('bot');

const playerBoard = new Board(10, 10);
const botBoard = new Board(10, 10);

playerBoard.displayBoard();
botBoard.displayBoard();

/*-----------accessing to DOM table--------------*/
const tables = document.querySelectorAll('table');

const playerTable = tables[0];
const botTable = tables[1];

playerTable.setAttribute('class', 'playerTable');
botTable.setAttribute('class', 'botTable');

const playerCells = document.querySelectorAll('.playerTable > tr > td');
const botCells = document.querySelectorAll('.botTable > tr > td');


/*----------setting ships on boards-----------*/
playerBoard.setShips(playerCells, player.shipsLocation);
botBoard.setShips(botCells, bot.shipsLocation);

/*-----------------------------------*/
player.playerTurn();

/*--------------drag & drop events----------------*/
let draggableShip = {};

playerTable.addEventListener('dragstart', dragStartHandler, { capture: true});
playerTable.addEventListener('dragend', dragEndHandler, { capture: true});
playerTable.addEventListener('dragover', dragOverHandler, { capture: true });
playerTable.addEventListener('drop', dropHandler, { capture: true }) 

function dragStartHandler(e) {
  if (e.target.matches('td.ship')) {
    for (const ship of player.shipsLocation) {
      for (let i = 0; i < ship.length; i++) {
        if (ship[i] === Number(e.target.classList[0].split('-').join(''))) {
          draggableShip[0] = ship;
        }        
      }
    }
    e.dataTransfer.clearData();
    e.dataTransfer.setData('text/plain', JSON.stringify(draggableShip));
    for (let i = 0; i < draggableShip[0].length; i++) {
      playerCells[draggableShip[0][i]].textContent = '';
      playerCells[draggableShip[0][i]].classList.remove('ship');
      playerCells[draggableShip[0][i]].classList.add('dragging');
    }
  }
};

function dragEndHandler() {
  for (let i = 0; i < draggableShip[0].length; i++) {
    playerCells[draggableShip[0][i]].classList.remove('dragging');
  }
};

function dragOverHandler(e) {
  e.preventDefault();
};

function dropHandler(e) {
  //???? how to prevent draging outside the table????
  const data= e.dataTransfer.getData("text");
  let strToObj = JSON.parse(data);
  let newShipLocations = [];
  let targetCell = Number(e.target.classList[0].split('-').join(''));
  for (let i = 0; i < strToObj[0].length; i++) {
    if (10 - targetCell % 10 >= strToObj[0].length) {
      playerCells[targetCell+i].textContent = '1';
      playerCells[targetCell+i].classList.add('ship');
     newShipLocations.push(targetCell+i);
    } else {
      playerCells[targetCell-i].textContent = '1';
      playerCells[targetCell-i].classList.add('ship'); 
      newShipLocations.push(targetCell-i); 
    }
  }
  player.shipsLocation[strToObj[0].length-1] = (newShipLocations); 
};
  

/*-------------Starting Game-------------------*/
startBtn.addEventListener('click', (e) => {
  console.log('working')
  botTable.style.display = 'table';
  playerTable.style.width = '220px'; 
  playerTable.style.height = '220px';
  playerTable.style.fontSize = '12px';
  startBtn.style.display = 'none';
  p.style.display = 'none';
  // prevent moving ships after starting the game
  playerTable.removeEventListener('dragstart',dragStartHandler, { capture: true });
  playerTable.removeEventListener('dragend', dragEndHandler, { capture: true });
  playerTable.removeEventListener('dragover', dragOverHandler, { capture: true });
  playerTable.removeEventListener('drop', dropHandler, { capture: true });

  
  for (let i = 0; i < 6; i++) {
    const li = document.createElement('li');
    for (let j = 0; j < i+1; j++) {
      const damagedShip = document.createElement('div');
      damagedShip.setAttribute('class', `damagedShip-${bot.shipsLocation[i][j]}`);
      li.append(damagedShip);
    }
    ul.append(li);
  }
  div.append(ul);
}); 

