const main = document.querySelector('main');

let randomMemo = new Set();

class Board {
  constructor(col, row) {
    this.col = col;
    this.row = row;
  }

  createBoard() {
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

  display() {

  }
}

const player = {
  turn: true,
  board: new Board(10, 10),
};

const bot = {
  turn: false,
  board: new Board(10, 10),
};

player.board.createBoard();
bot.board.createBoard();

const tables = document.querySelectorAll('table');

const playerTable = tables[0];
const botTable = tables[1];

playerTable.setAttribute('class', 'playerTable');
botTable.setAttribute('class', 'botTable');

const cells = document.querySelectorAll('.playerTable > tr > td'); 

botTable.addEventListener('click', (e) => {
  console.log('clicking');
  bot.fleet.forEach((ship) => {
    ship.forEach(cell => {
      if (cell === 'ship exist') {
        e.target.style.backgroundColor = 'red';
      } else {
        e.target.textContent = '×';
      }
    });
  });
});

class Ship {
  constructor() {
    this.fleet = [
      ['0-0'],
      ['0-0','0-2'],
      ['0-0','0-1','0-2'],
      ['0-0','0-1','0-2','0-3'],
      ['0-0','0-1','0-2','0-3','0-4'],
      ['0-0','0-1','0-2','0-3','0-4','0-5'],
    ];
  }

  damage() {

  }

  set() {
    let p = 0;
    while(p < this.fleet.length) {
      // should check for getting same random number
      let randomCells = [];
      let count = this.fleet[p].length;
      let random = Math.floor(Math.random() * 93);
      while(count > 0) {
        if(random % 10 >= count) {
          cells[random - count].textContent = '1';
          cells[random-count].classList.add('filled');
          randomCells.push(random-count);
          count--;
        } else {
          random = Math.floor(Math.random() * 93);
        }
      }
      randomMemo.add(randomCells);
      p++;
    }
    console.log(randomMemo)
  }
}

let myship = new Ship();
myship.set();

const filled = document.querySelectorAll('.filled');

filled.addEventListener('dragstart', (e) => {
  console.log('start draging...');

});

filled.addEventListener('dragend', (e) => {
  console.log('draging end!');

});