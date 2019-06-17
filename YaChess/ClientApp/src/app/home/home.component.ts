//шах и мат
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
  check: boolean;

  mainFigures: Figure[] = [];
  secondaryFigures: Figure[] = [];
  buttonsToMove: HTMLButtonElement[] = [];
  figures: Figure[] = [];

  mainFiguresEnemy: Figure[] = [];
  secondaryFiguresEnemy: Figure[] = [];
  buttonsToMoveEnemy: HTMLButtonElement[] = [];
  figuresEnemy: Figure[] = [];

  fakeSteps: HTMLButtonElement[] = [];

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

  createButton(selectedFigure: Figure, index: number, x: number, y: number,
    enemy: boolean, pawn?: boolean, secondary?: boolean, move?: number, check?: boolean, figureToInclude?: Figure) {
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

    if (figureToInclude === undefined) {
      console.log(`hahahah`);

    }

    if (check && figureToInclude !== undefined) { //если делаются "фейковые" ходы, включить в проверку ту 1 фигуру, относительно которой до этого рисовались клетки
      if (figureToInclude.x === newx && figureToInclude.y === newy) {
        return;
      }

      switch (index) {
        case 0:
        case 7:
          if (this.rookValidation(newx, newy, figureToInclude, selectedFigure)) {
            return;
          }
          break;
        case 2:
        case 5:
          if (this.bishopValidation(newx, newy, figureToInclude, selectedFigure)) {
            return;
          }
          break;
        case 3:
          if (this.rookValidation(newx, newy, figureToInclude, selectedFigure) || this.bishopValidation(newx, newy, figureToInclude, selectedFigure)) {
            return;
          }
      }
    }

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

            if (figureEnemy.x === newx && figureEnemy.y === newy) { //даже если +2
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

            if (figureEnemy.x === newx && figureEnemy.y === newy) { //даже если +2
              return;
            }
          }

          if (figure.x === newx && figure.y + 1 === newy) { //чтобы "своя" пешка не перепрыгивала "свои" фигуры
            return;
          }
        }
      }
    }

    let buttonCoordx: number = selectedFigure.coordx + x * this.STEP;
    let buttonCoordy: number = enemy ? selectedFigure.coordy + y * this.STEP : selectedFigure.coordy - y * this.STEP;

    //определяем, совпадает ли координата, которая рисовалась бы, с координатой вражеского короля (beta)
    if (check) {
      let kingEnemy: Figure = enemy ? this.mainFigures[4] : this.mainFiguresEnemy[4];

      if (buttonCoordx === kingEnemy.coordx && buttonCoordy === kingEnemy.coordy) {
        this.check = true;
        console.log(kingEnemy);
        //return;
      }

      return;
    }

    let button = document.createElement("button");
    button.style.border = '0';
    button.style.background = 'none';
    button.style.color = '#d51d1d';

    button.style.fontSize = '30px';
    button.innerHTML = '•';

    button.style.left = `${buttonCoordx}px`;
    button.style.top = `${buttonCoordy}px`;

    document.getElementsByTagName("body")[0].appendChild(button);

    let buttonsToMove: HTMLButtonElement[] = enemy ?
      this.buttonsToMoveEnemy : this.buttonsToMove;

    //

    this.fakeSteps.push(button);

    //

    if (check) return;

    button.addEventListener("click", function () {
      if (this.check) {
        //проиграть развитие событий с данным ходом чёрных
        //если он ведёт к избавлению от шаха - походить
        this.check = false;

        //console.log(`hah`);

        let tmpx: number = selectedFigure.x;
        let tmpy: number = selectedFigure.y;
        let tmpcoordx: number = selectedFigure.coordx;
        let tmpcoordy: number = selectedFigure.coordy;
        let tmpfirstMove: boolean = selectedFigure.firstMove;

        console.log(`${x} ${y}`);

        selectedFigure.coordx += x * this.STEP;

        if (enemy) {
          selectedFigure.coordy += y * this.STEP;
        } else {
          selectedFigure.coordy -= y * this.STEP;
        }

        selectedFigure.x = newx;
        selectedFigure.y = newy;
        selectedFigure.firstMove = true;

        this.doFakeSteps(!enemy, undefined);

        if (this.check) {
          selectedFigure.x = tmpx;
          selectedFigure.y = tmpy;
          selectedFigure.coordx = tmpcoordx;
          selectedFigure.coordy = tmpcoordy;
          selectedFigure.firstMove = tmpfirstMove;
          console.log(`cant move there`);
          return;
        }
      }

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

      this.doFakeSteps(enemy, selectedFigure); //"фейковые" шаги для всех фигур
    }.bind(this));

    buttonsToMove.push(button);
  }

  changePosition(index: number, mainFigure: boolean, enemy?: boolean) {
    //чистка "фейковых" кнопок (временно)
    this.fakeSteps.forEach(button => button.remove());
    this.fakeSteps.length = 0;
    //

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
            this.rookSteps(selectedFigure, index, i, enemy, false, undefined);
            break;
          case 1:
          case 6:
            this.knightSteps(selectedFigure, index, i, enemy, false, undefined);
            return;
          case 2:
          case 5:
            this.bishopSteps(selectedFigure, index, i, enemy, false, undefined);
            break;
          case 3:
            this.queenSteps(selectedFigure, index, i, enemy, false, undefined);
            break;
          case 4:
            this.kingSteps(selectedFigure, index, i, enemy, false, undefined);
            return;
        }
      } else {
        this.pawnSteps(selectedFigure, index, i, enemy, false, undefined);
        return;
      }
    }
  }

  rookSteps(selectedFigure: Figure, index: number, i: number, enemy: boolean, check: boolean, figureToInclude: Figure) {
    this.createButton(selectedFigure, index, i, 0, enemy, undefined, undefined, 1, check, figureToInclude);
    this.createButton(selectedFigure, index, -i, 0, enemy, undefined, undefined, 2, check, figureToInclude);
    this.createButton(selectedFigure, index, 0, i, enemy, undefined, undefined, 3, check, figureToInclude);
    this.createButton(selectedFigure, index, 0, -i, enemy, undefined, undefined, 4, check, figureToInclude);
  }

  knightSteps(selectedFigure: Figure, index: number, i: number, enemy: boolean, check: boolean, figureToInclude: Figure) {
    this.createButton(selectedFigure, index, i, i + 1, enemy, undefined, undefined, undefined, check, figureToInclude);
    this.createButton(selectedFigure, index, -i, i + 1, enemy, undefined, undefined, undefined, check, figureToInclude);
    this.createButton(selectedFigure, index, i, i - 3, enemy, undefined, undefined, undefined, check, figureToInclude);
    this.createButton(selectedFigure, index, -i, i - 3, enemy, undefined, undefined, undefined, check, figureToInclude);
    this.createButton(selectedFigure, index, i + 1, i - 2, enemy, undefined, undefined, undefined, check, figureToInclude);
    this.createButton(selectedFigure, index, i + 1, i, enemy, undefined, undefined, undefined, check, figureToInclude);
    this.createButton(selectedFigure, index, i - 3, i, enemy, undefined, undefined, undefined, check, figureToInclude);
    this.createButton(selectedFigure, index, i - 3, i - 2, enemy, undefined, undefined, undefined, check, figureToInclude);
  }

  bishopSteps(selectedFigure: Figure, index: number, i: number, enemy: boolean, check: boolean, figureToInclude: Figure) {
    this.createButton(selectedFigure, index, i, i, enemy, undefined, undefined, 5, check, figureToInclude);
    this.createButton(selectedFigure, index, -i, i, enemy, undefined, undefined, 6, check, figureToInclude);
    this.createButton(selectedFigure, index, i, -i, enemy, undefined, undefined, 7, check, figureToInclude);
    this.createButton(selectedFigure, index, -i, -i, enemy, undefined, undefined, 8, check, figureToInclude);
  }

  queenSteps(selectedFigure: Figure, index: number, i: number, enemy: boolean, check: boolean, figureToInclude: Figure) {
    this.rookSteps(selectedFigure, index, i, enemy, check, figureToInclude);
    this.bishopSteps(selectedFigure, index, i, enemy, check, figureToInclude);
  }

  kingSteps(selectedFigure: Figure, index: number, i: number, enemy: boolean, check: boolean, figureToInclude: Figure) {
    this.createButton(selectedFigure, index, i, 0, enemy, undefined, undefined, undefined, check, figureToInclude);
    this.createButton(selectedFigure, index, -i, 0, enemy, undefined, undefined, undefined, check, figureToInclude);
    this.createButton(selectedFigure, index, 0, i, enemy, undefined, undefined, undefined, check, figureToInclude);
    this.createButton(selectedFigure, index, 0, -i, enemy, undefined, undefined, undefined, check, figureToInclude);
    this.createButton(selectedFigure, index, i, i, enemy, undefined, undefined, undefined, check, figureToInclude);
    this.createButton(selectedFigure, index, i, -i, enemy, undefined, undefined, undefined, check, figureToInclude);
    this.createButton(selectedFigure, index, -i, i, enemy, undefined, undefined, undefined, check, figureToInclude);
    this.createButton(selectedFigure, index, -i, -i, enemy, undefined, undefined, undefined, check, figureToInclude);
  }

  pawnSteps(selectedFigure: Figure, index: number, i: number, enemy: boolean, check: boolean, figureToInclude: Figure) {
    this.createButton(selectedFigure, index, -1, i, enemy, undefined, true, undefined, check, figureToInclude);
    this.createButton(selectedFigure, index, 1, i, enemy, undefined, true, undefined, check, figureToInclude);

    this.createButton(selectedFigure, index, 0, i, enemy, undefined, undefined, 0, check, figureToInclude);

    if (!selectedFigure.firstMove) {
      this.createButton(selectedFigure, index, 0, i + 1, enemy, true, undefined, undefined, check, figureToInclude);
    }
  }

  doFakeSteps(enemy: boolean, figureToInclude: Figure) { //"фейковые" шаги для всех фигур, чтобы определить, стоит ли у них на пути вражеский король
    let mainFigures: Figure[] = enemy ? this.mainFiguresEnemy : this.mainFigures;
    let secondaryFigures: Figure[] = enemy ? this.secondaryFiguresEnemy : this.secondaryFigures;

    if (figureToInclude !== undefined) {
      console.log(mainFigures);
      console.log(secondaryFigures);
    }

    for (let i: number = 0; i < mainFigures.length; i++) { //"фейковые" шаги для главных фигур
      if (mainFigures[i].x !== -1 && mainFigures[i].y !== -1) {
        switch (i) {
          case 0:
          case 7:
            for (let j: number = 1; j < 8; j++) {
              this.rookSteps(mainFigures[i], i, j, enemy, true, figureToInclude);
            }
            break;
          case 1:
          case 6:
            this.knightSteps(mainFigures[i], i, 1, enemy, true, figureToInclude);
            break;
          case 2:
          case 5:
            for (let j: number = 1; j < 8; j++) {
              this.bishopSteps(mainFigures[i], i, j, enemy, true, figureToInclude);
            }
            break;
          case 3:
            for (let j: number = 1; j < 8; j++) {
              this.queenSteps(mainFigures[i], i, j, enemy, true, figureToInclude);
            }
            break;
          case 4:
            this.kingSteps(mainFigures[i], i, 1, enemy, true, figureToInclude);
            break;
        }
      }
    }

    for (let i: number = 0; i < secondaryFigures.length; i++) { //"фейковые" шаги для пешек
      if (secondaryFigures[i].x !== -1 && secondaryFigures[i].y !== -1) {
        this.pawnSteps(secondaryFigures[i], i, 1, enemy, true, figureToInclude);
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
