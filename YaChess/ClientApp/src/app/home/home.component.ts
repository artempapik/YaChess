//шах
//на короле клеточки не рисовать
//если пешка доходит до конца вражеского поля, она становится ферзём
//рокировка

import { Figure } from '../services/figure';
import { Component } from '@angular/core';

@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})

export class HomeComponent {
  readonly STEP: number = 50;

  mainFigures: Figure[] = [];
  secondaryFigures: Figure[] = [];
  buttonsToMove: HTMLButtonElement[] = [];
  figures: Figure[] = [];

  mainFiguresEnemy: Figure[] = [];
  secondaryFiguresEnemy: Figure[] = [];
  buttonsToMoveEnemy: HTMLButtonElement[] = [];
  figuresEnemy: Figure[] = [];

  ngOnInit() {
    let coordx: number = 600;

    for (let i: number = 0; i < 8; i++) {
      this.mainFigures.push(new Figure(`main${i}`, i, 0, coordx, 400));
      this.secondaryFigures.push(new Figure(`secondary${i}`,i, 1, coordx, 350));
      this.mainFiguresEnemy.push(new Figure(`mainEnemy${i}`, i, 7, coordx, 50));
      this.secondaryFiguresEnemy.push(new Figure(`secondaryEnemy${i}`, i, 6, coordx, 100));

      coordx += this.STEP;
    }
  }

  createButton(selectedFigure: Figure, index: number, x: number, y: number, enemy: boolean, pawn?: boolean, secondary?: boolean, move?: number) {
    let newx: number = selectedFigure.x + x; //предполагаемая координата x, где будет рисоваться клетка
    let newy: number = enemy ? //предполагаемая координата y, где будет рисоваться клетка (в зависимости от "своей" или вражеской фигуры)
      selectedFigure.y - y : selectedFigure.y + y;

    if (newx > 7 || newx < 0 || newy > 7 || newy < 0) { //не выходить за пределы доски
      return;
    }

    let figures: Figure[] = enemy ? this.figuresEnemy : this.figures;
    let figuresEnemy: Figure[] = enemy ? this.figures : this.figuresEnemy;

    if (secondary) { //для пешки: если на правой верхней клетке есть враг - рисовать клетку
      let canBeat: boolean = false;

      for (let figureEnemy of figuresEnemy) {
        if (figureEnemy.x === newx && figureEnemy.y === newy) {
          canBeat = true;
          break;
        }
      }

      if (!canBeat) {
        return;
      }
    }

    //при совпадении будущих координат фигуры с вражескими - не рисовать ход, кроме одной клетки (НО для пешки, коня, короля(?) - рисовать)
    if (!secondary) {
      for (let figureEnemy of figuresEnemy) {
        if (move !== undefined) {
          let xWatch: number;
          let yWatch: number;

          switch (move) {
            case 0: //пешка
              xWatch = figureEnemy.x;
              yWatch = figureEnemy.y;
              break;
            //ладья
            case 1: //вправо
              xWatch = figureEnemy.x + 1;
              yWatch = figureEnemy.y;
              break;
            case 2: //влево
              xWatch = figureEnemy.x - 1;
              yWatch = figureEnemy.y;
              break;
            case 3: //вверх
              xWatch = figureEnemy.x;
              yWatch = enemy ? figureEnemy.y - 1 : figureEnemy.y + 1;
              break;
            case 4: //вниз
              xWatch = figureEnemy.x;
              yWatch = enemy ? figureEnemy.y + 1 : figureEnemy.y - 1;
              break;
            //слон
            case 5: //северо-восток
              xWatch = figureEnemy.x + 1;
              yWatch = enemy ? figureEnemy.y - 1 : figureEnemy.y + 1;
              break;
            case 6: //северо-запад
              xWatch = figureEnemy.x - 1;
              yWatch = enemy ? figureEnemy.y - 1 : figureEnemy.y + 1;
              break;
            case 7: //юго-восток
              xWatch = figureEnemy.x + 1;
              yWatch = enemy ? figureEnemy.y + 1 : figureEnemy.y - 1;
              break;
            case 8: //юго-запад
              xWatch = figureEnemy.x - 1;
              yWatch = enemy ? figureEnemy.y + 1 : figureEnemy.y - 1;
              break;
          }

          if (xWatch === newx && yWatch === newy) {
            return;
          }
        }
      }
    }

    let allFigures: Figure[] = [];
    figuresEnemy.forEach(figure => allFigures.push(figure));
    figures.forEach(figure => allFigures.push(figure));

    for (let figure of allFigures) { //валидация "перепрыгиваний" для всех фигур
      switch (index) {
        case 0:
        case 7:
          if (this.rookValidation(newx, newy, figure, selectedFigure)) {
            return;
          }
          break;
        case 2:
        case 5:
          if (this.bishopValidation(newx, newy, figure, selectedFigure)) {
            return;
          }
          break;
        case 3:
          if (this.rookValidation(newx, newy, figure, selectedFigure) || this.bishopValidation(newx, newy, figure, selectedFigure)) {
            return;
          }
      }
    }

    allFigures.length = 0;

    for (let figure of figures) {
      if (figure.x === newx && figure.y === newy) { //новый ход не будет показываться на месте, где есть другая "своя" фигура
        return;
      }

      if (pawn) {
        if (enemy) {
          for (let figureEnemy of figuresEnemy) { //чтобы вражеская пешка не перепрыгивала вражеские фигуры
            if (figureEnemy.x === newx && figureEnemy.y - 1 === newy) {
              return;
            }
          }

          if (figure.x === newx && figure.y - 1 === newy) { //чтобы вражеская пешка не перепрыгивала "свои" фигуры
            return;
          }
        } else {
          for (let figureEnemy of figuresEnemy) { //чтобы "своя" пешка не перепрыгивала вражеские фигуры
            if (figureEnemy.x === newx && figureEnemy.y + 1 === newy) {
              return;
            }
          }

          if (figure.x === newx && figure.y + 1 === newy) { //чтобы "своя" пешка не перепрыгивала "свои" фигуры
            return;
          }
        }
      }
    }

    let button = document.createElement("button");
    button.style.border = '0';
    button.style.background = 'none';
    button.style.color = '#e62b2b';

    button.style.fontSize = '25px';
    button.innerHTML = '•';

    button.style.left = `${selectedFigure.coordx + x * this.STEP}px`;
    button.style.top = enemy ?
      `${selectedFigure.coordy + y * this.STEP}px` : `${selectedFigure.coordy - y * this.STEP}px`;

    document.getElementsByTagName("body")[0].appendChild(button);

    let buttonsToMove: HTMLButtonElement[] = enemy ?
      this.buttonsToMoveEnemy : this.buttonsToMove;

    button.addEventListener("click", function () {
      for (let figure of figuresEnemy) {
        if (button.style.left === `${figure.coordx}px` && button.style.top === `${figure.coordy}px`) {
          let buttonToDelete: HTMLElement = document.getElementById(figure.id);

          if (buttonToDelete !== null) {
            buttonToDelete.remove(); //удаление кнопки врага при совпадении
          }

          figure.x = -1;
          figure.y = -1;
          break;
        }
      }

      //отключение "своих" кнопок и включение кнопок противника
      (document.getElementById(selectedFigure.id) as HTMLButtonElement).disabled = true;
      for (let figure of figures) {
        let button: HTMLButtonElement = document.getElementById(figure.id) as HTMLButtonElement;
        
        if (button != null) {
          button.disabled = true;
        }
      }

      for (let figure of figuresEnemy) {
        let button: HTMLButtonElement = document.getElementById(figure.id) as HTMLButtonElement;

        if (button != null) {
          button.disabled = false;
        }
      }

      document.getElementById(selectedFigure.id).style.left = button.style.left;
      document.getElementById(selectedFigure.id).style.top = button.style.top;

      selectedFigure.coordx += x * this.STEP;

      if (enemy) {
        selectedFigure.coordy += y * this.STEP;
      } else {
        selectedFigure.coordy -= y * this.STEP;
      }

      selectedFigure.x = newx;
      selectedFigure.y = newy;
      selectedFigure.firstMove = true;

      buttonsToMove.forEach(button => button.remove());
      buttonsToMove.length = 0;
    }.bind(this));

    buttonsToMove.push(button);
  }

  changePosition(index: number, mainFigure: boolean, enemy?: boolean) {
    this.figures.length = 0;
    this.figuresEnemy.length = 0;

    let selectedFigure: Figure = mainFigure ?
      enemy ? this.mainFiguresEnemy[index] : this.mainFigures[index] :
      enemy ? this.secondaryFiguresEnemy[index] : this.secondaryFigures[index];

    //чистка кнопок
    this.buttonsToMove.forEach(button => button.remove());
    this.buttonsToMoveEnemy.forEach(button => button.remove());
    this.buttonsToMove.length = 0;
    this.buttonsToMoveEnemy.length = 0;

    //заполнение массива "своих" и вражеских фигур
    this.mainFigures.forEach(figure => this.figures.push(figure));
    this.secondaryFigures.forEach(figure => this.figures.push(figure));
    this.mainFiguresEnemy.forEach(figure => this.figuresEnemy.push(figure));
    this.secondaryFiguresEnemy.forEach(figure => this.figuresEnemy.push(figure));

    let indexToDelete = mainFigure ? index : index + 8;

    if (enemy) {
      this.figuresEnemy.splice(indexToDelete, 1);
    } else {
      this.figures.splice(indexToDelete, 1);
    }

    for (let i: number = 1; i < 8; i++) {
      if (mainFigure) {
        switch (index) {
          case 0:
          case 7:
            this.rookSteps(selectedFigure, index, i, enemy);
            break;
          case 1:
          case 6:
            this.knightSteps(selectedFigure, index, i, enemy);
            return;
          case 2:
          case 5:
            this.bishopSteps(selectedFigure, index, i, enemy);
            break;
          case 3:
            this.queenSteps(selectedFigure, index, i, enemy);
            break;
          case 4:
            this.kingSteps(selectedFigure, index, i, enemy);
            return;
        }
      } else {
        this.pawnSteps(selectedFigure, index, i, enemy);
        return;
      }
    }
  }

  rookSteps(selectedFigure: Figure, index: number, i: number, enemy: boolean) {
    this.createButton(selectedFigure, index, i, 0, enemy, undefined, undefined, 1);
    this.createButton(selectedFigure, index, -i, 0, enemy, undefined, undefined, 2);
    this.createButton(selectedFigure, index, 0, i, enemy, undefined, undefined, 3);
    this.createButton(selectedFigure, index, 0, -i, enemy, undefined, undefined, 4);
  }

  knightSteps(selectedFigure: Figure, index: number, i: number, enemy: boolean) {
    this.createButton(selectedFigure, index, i, i + 1, enemy);
    this.createButton(selectedFigure, index, -i, i + 1, enemy);
    this.createButton(selectedFigure, index, i, i - 3, enemy);
    this.createButton(selectedFigure, index, -i, i - 3, enemy);
    this.createButton(selectedFigure, index, i + 1, i - 2, enemy);
    this.createButton(selectedFigure, index, i + 1, i, enemy);
    this.createButton(selectedFigure, index, i - 3, i, enemy);
    this.createButton(selectedFigure, index, i - 3, i - 2, enemy);
  }

  bishopSteps(selectedFigure: Figure, index: number, i: number, enemy: boolean) {
    this.createButton(selectedFigure, index, i, i, enemy, undefined, undefined, 5);
    this.createButton(selectedFigure, index, -i, i, enemy, undefined, undefined, 6);
    this.createButton(selectedFigure, index, i, -i, enemy, undefined, undefined, 7);
    this.createButton(selectedFigure, index, -i, -i, enemy, undefined, undefined, 8);
  }

  queenSteps(selectedFigure: Figure, index: number, i: number, enemy: boolean) {
    this.rookSteps(selectedFigure, index, i, enemy);
    this.bishopSteps(selectedFigure, index, i, enemy);
  }

  kingSteps(selectedFigure: Figure, index: number, i: number, enemy: boolean) {
    this.createButton(selectedFigure, index, i, 0, enemy);
    this.createButton(selectedFigure, index, -i, 0, enemy);
    this.createButton(selectedFigure, index, 0, i, enemy);
    this.createButton(selectedFigure, index, 0, -i, enemy);
    this.createButton(selectedFigure, index, i, i, enemy);
    this.createButton(selectedFigure, index, i, -i, enemy);
    this.createButton(selectedFigure, index, -i, i, enemy);
    this.createButton(selectedFigure, index, -i, -i, enemy);
  }

  pawnSteps(selectedFigure: Figure, index: number, i: number, enemy: boolean) {
    let pawnBeat: number = enemy ? -1 : 1;
    this.createButton(selectedFigure, index, pawnBeat, i, enemy, undefined, true);

    this.createButton(selectedFigure, index, 0, i, enemy, undefined, undefined, 0);

    if (!selectedFigure.firstMove) {
      this.createButton(selectedFigure, index, 0, i + 1, enemy, true);
    }
  }

  fakeSteps() { //"фейковые" шаги для всех фигур, чтобы определить, стоит ли у них на пути вражеский король
    //"фейковые" шаги для ладьи, слона и ферзя (по 8 в каждую сторону)
    for (let i: number = 0; i < this.mainFigures.length; i++) {
      if (this.mainFigures[i].x !== -1 && this.mainFigures[i].y !== -1) {
        switch (i) {
          case 0:
          case 7:
            this.rookSteps(this.mainFigures[i], i, i + 1, undefined);
            break;
          case 2:
          case 5:
            this.bishopSteps(this.mainFigures[i], i, i + 1, undefined);
            break;
          case 3:
            this.queenSteps(this.mainFigures[i], i, i + 1, undefined);
            break;
        }
      }
    }

    //"фейковые" шаги для коня и короля
    for (let i: number = 0; i < this.mainFigures.length; i++) {
      if (this.mainFigures[i].x !== -1 && this.mainFigures[i].y !== -1) {
        switch (i) {
          case 1:
          case 6:
            this.knightSteps(this.mainFigures[i], i, i + 1, undefined);
            break;
          case 4:
            this.kingSteps(this.mainFigures[i], i, i + 1, undefined);
            break;
        }
      }
    }

    for (let i: number = 0; i < this.secondaryFigures.length; i++) {
      if (this.secondaryFigures[i].x !== -1 && this.secondaryFigures[i].y !== -1) {
        this.pawnSteps(this.secondaryFigures[i], i, i + 1, undefined);
      }
    }
  }

  rookValidation(newx: number, newy: number, figure: Figure, selectedFigure: Figure): boolean {
    if (newx > selectedFigure.x && newy === selectedFigure.y) {
      return figure.y === selectedFigure.y && figure.x > selectedFigure.x && figure.x < newx;
    } else if (newx < selectedFigure.x && newy === selectedFigure.y) {
      return figure.y === selectedFigure.y && figure.x < selectedFigure.x && figure.x > newx;
    } else if (newx === selectedFigure.x && newy > selectedFigure.y) {
      return figure.x === selectedFigure.x && figure.y > selectedFigure.y && figure.y < newy;
    } else if (newx === selectedFigure.x && newy < selectedFigure.y) {
      return figure.x === selectedFigure.x && figure.y < selectedFigure.y && figure.y > newy;
    }
  }

  bishopValidation(newx: number, newy: number, figure: Figure, selectedFigure: Figure): boolean {
    if (newx > selectedFigure.x && newy > selectedFigure.y) {
      return figure.x > selectedFigure.x && figure.y > selectedFigure.y && figure.x < newx && figure.y < newy &&
        figure.x - selectedFigure.x === figure.y - selectedFigure.y;
    } else if (newx < selectedFigure.x && newy > selectedFigure.y) {
      return figure.x < selectedFigure.x && figure.y > selectedFigure.y && figure.x > newx && figure.y < newy &&
        Math.abs(figure.x - selectedFigure.x) === figure.y - selectedFigure.y;
    } else if (newx > selectedFigure.x && newy < selectedFigure.y) {
      return figure.x > selectedFigure.x && figure.y < selectedFigure.y && figure.x < newx && figure.y > newy &&
        figure.x - selectedFigure.x === Math.abs(figure.y - selectedFigure.y);
    } else if (newx < selectedFigure.x && newy < selectedFigure.y) {
      return figure.x < selectedFigure.x && figure.y < selectedFigure.y && figure.x > newx && figure.y > newy &&
        figure.x - selectedFigure.x === figure.y - selectedFigure.y;
    }
  }

  setStyles(i: number, mainFigure: boolean, enemy?: boolean) {
    let arr: Figure[] = mainFigure ?
      enemy ? this.mainFiguresEnemy : this.mainFigures :
      enemy ? this.secondaryFiguresEnemy : this.secondaryFigures;

    let imgUrl: string = enemy ? 'pawnEnemy' : 'pawn';

    if (mainFigure) {
      switch (i) {
        case 0:
        case 7:
          imgUrl = 'rook';
          break;
        case 1:
        case 6:
          imgUrl = 'knight';
          break;
        case 2:
        case 5:
          imgUrl = 'bishop';
          break;
        case 3:
          imgUrl = 'queen';
          break;
        case 4:
          imgUrl = 'king';
          break;
      }

      if (enemy) {
        imgUrl += 'Enemy';
      }
    }

    return {
      'left': `${arr[i].coordx}px`,
      'top': `${arr[i].coordy}px`,
      'background': `url(${imgUrl}.png)`
    };
  }
}
