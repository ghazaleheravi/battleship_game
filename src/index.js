const main = document.querySelector('main');

/*------Board class------*/
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

  setShips(cells, shipsLocation) {
    let p = 0;
    let memo = {};
    while(p < this.fleet.length) {
      let randomCells = {};
      let length = this.fleet[p].length;
      let random = Math.floor(Math.random() * 99);
      let isExisting = false;
      if(10-random % 10 > length) {
        let i = 1;
        while (i <= length) {
          if(memo[random + i]) { 
            isExisting = true;
            break;
          } else { 
            memo[random+i] = true;
            i++;
          }
        }    
        if (!isExisting) {
          while(length > 0) {
            cells[random + length].textContent = '1';
            cells[random + length].classList.add('filled');
            randomCells[random + length] = true;
            length--;
          }
          shipsLocation.push(randomCells);
          p++;
        }
      }
    }
    console.log('locationOfShips: ',shipsLocation);
  }
}

/*-------Players class-------*/
//just create one turn to bot or you!!
class Players {
  constructor(player, turn) {
    this.player = player;
    this.turn = turn;
    this.shipsCount = 6;
    this.shipsLocation = [];
    this.damagedShips = {};
    this.win = false;
  }

  botPlay() {
    setTimeout(() => {
    let random = Math.floor(Math.random() * 99);
    console.log(random);
    if (yourCells[random].classList[1] === 'filled') {
        yourCells[random].style.backgroundColor = 'red';
      } else {
        yourCells[random].textContent = '×';
        bot.turn = !bot.turn;
        you.turn = !you.turn;
      }
    }, 2000)  
  }
    
  

  youPlay() {
    botTable.addEventListener('click', (e) => {
      console.log('clicked');
      if (e.target.matches('td.filled')) {
        for(const ship of bot.shipsLocation) {
          for (let i = 0; i < ship.length; i++) {
            if (Number((e.target.className.split(' ')[0].split('-').join(''))) === ship[i]) {
              bot.damagedShips[ship.length] = !bot.damagedShips[ship.length] ?  1 : bot.damagedShips[ship.length]+1;
              if (bot.damagedShips[ship.length] === ship.length) {
                bot.shipsCount--;
                console.log(bot.shipsCount);
                break;
              } 
            }
          }
          if (bot.shipsCount === 0) {
            you.win = true;
            console.log('you won: ',you.win);
          }
        }
        e.target.style.backgroundColor = 'red';
      } else {
        e.target.textContent = '×';
        you.turn = !you.turn;
        bot.turn = !bot.turn;
        bot.botPlay();
      }
    });
  }
}

/*------Players & Board instances------*/
const you = new Players('you', true);
const bot = new Players('bot', false);

const yourBoard = new Board(10, 10);
const botBoard = new Board(10, 10);

yourBoard.displayBoard();
botBoard.displayBoard();

/*-----------accessing to DOM table--------------*/
const tables = document.querySelectorAll('table');

const yourTable = tables[0];
const botTable = tables[1];

yourTable.setAttribute('class', 'yourTable');
botTable.setAttribute('class', 'botTable');

const yourCells = document.querySelectorAll('.yourTable > tr > td');
const botCells = document.querySelectorAll('.botTable > tr > td');

/*----------setting ships on boards-----------*/
yourBoard.setShips(yourCells, you.shipsLocation);
botBoard.setShips(botCells, bot.shipsLocation);

/*-----------------------------------*/

you.youPlay();

/*--------------drag & drop events----------------*/
/*
yourTable.addEventListener('dragstart', (e) => {
  console.log('dragstart');
  if (e.target.matches('td.filled')) {
    console.log('filled td picked')
    e.target.classList.add('dragging');
    e.dataTransfer.clearData();
    e.dataTransfer.setData('text/plain', e.target.textContent);
  }
});

yourTable.addEventListener('dragend', (e) => {
  console.log('end!');
  e.target.classList.remove('dragging');
});

for(let i = 0; i < cells.length; i++) {
  if (cells[i].className !== ('td.filled')) {
    cells[i].addEventListener('dragover', (e) => {
      console.log('dragover')
      e.preventDefault();
    });
    cells[i].addEventListener('drop', (e) => {
      console.log('drop')
      e.preventDefault();
      const data= e.dataTransfer.getData("text");
      //const sourse = document.getElementById(data);
      
      e.target.append(data);
    });
  }
}
*/
