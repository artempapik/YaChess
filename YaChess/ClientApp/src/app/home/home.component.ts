//TODO
//ход не должен выходить за пределы "доски"
//пересмотреть условие для ладьи

import { Component } from '@angular/core';
import { Figure } from '../services/figure';

@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})

export class HomeComponent {
  mainFigures: Figure[] = [];
  secondaryFigures: Figure[] = [];

  ngOnInit() {
    let x: number = 500;
    let mainY: number = 440;
    let secondaryY: number = 400;

    let fieldX: number = 0;
    let fieldY: number = 0;

    for (let i: number = 0; i < 8; i++) {
      this.mainFigures.push(new Figure(x, mainY, fieldX, fieldY));
      this.secondaryFigures.push(new Figure(x, secondaryY, fieldX, fieldY + 1));
      fieldX++;
      x += 50;
    }
  }

  changePosition(index: number, isMain: boolean) {
    let arr: Figure[] = isMain ? this.mainFigures : this.secondaryFigures;
    let id: string = isMain ? 'main' : 'secondary';

    let xsteps: number = +prompt('how much x?');
    let ysteps: number = +prompt('how much y?');

    //допустимые ходы для фигур
    if (isMain) {
      if (index === 0 || index === 7) { //ладья
        if (xsteps !== 0 && ysteps !== 0) {
          alert('can not');
          return;
        }
      } else if (index === 1 || index === 6) { //конь
        if (Math.abs(Math.abs(xsteps) - Math.abs(ysteps)) !== 1) {
          alert('can not');
          return;
        }
      } else if (index === 2 || index === 5) { //слон
        if (Math.abs(xsteps) !== Math.abs(ysteps)) {
          alert('can not');
          return;
        }
      } else if (index === 3) { //королева
        if ((xsteps !== 0 && ysteps !== 0) && (Math.abs(xsteps) !== Math.abs(ysteps))) {
          alert('can not');
          return;
        }
      } else { //король
        if ((xsteps !== 0 && Math.abs(xsteps) !== 1) || (ysteps !== 0 && Math.abs(ysteps) !== 1)) {
          alert('can not');
          return;
        }
      }
    } else { //пешка
      if (arr[index].firstMove) {
        if (xsteps !== 0 || ysteps !== 1) {
          alert('can not');
          return;
        }
      } else {
        if (xsteps !== 0 || (ysteps !== 1 && ysteps !== 2)) {
          alert('can not');
          return;
        }
      }
    }

    //новые координаты фигуры
    let newX: number = arr[index].x + 50 * xsteps;
    let newY: number = arr[index].y - 40 * ysteps;

    //новая позиция
    let newPosX: number = arr[index].fieldX + xsteps;
    let newPosY: number = arr[index].fieldY + ysteps;

    //позиция хода не может совпадать с позициями других своих фигур
    //фигуры не могут "перескакивать" друг через друга (кроме коня)
    if (isMain) { //фигура относится к главным - просматриваем все главные, кроме текущей, и все второстепенные
      for (let i: number = 0; i < this.mainFigures.length; i++) {
        if (index !== i) {
          if (newPosX === this.mainFigures[i].fieldX && newPosY === this.mainFigures[i].fieldY) {
            console.log('can not place here');
            return;
          }

          if (this.figuresValidation(index, i, newPosX, newPosY, this.mainFigures)) {
            return;
          }
        }
      }

      for (let i: number = 0; i < this.secondaryFigures.length; i++) {
        if (newPosX === this.secondaryFigures[i].fieldX && newPosY === this.secondaryFigures[i].fieldY) {
          console.log('can not place here');
          return;
        }

        if (this.figuresValidation(index, i, newPosX, newPosY, this.secondaryFigures)) {
          return;
        }
      }
    } else { //фигура относится к второстепенной - просматриваем все главные и все второстепенные, кроме текущей
      for (let i: number = 0; i < this.mainFigures.length; i++) {
        if (newX === this.mainFigures[i].x && newY === this.mainFigures[i].y) {
          return;
        }
      }

      for (let i: number = 0; i < this.secondaryFigures.length; i++) {
        if (index !== i) {
          if (newX === this.secondaryFigures[i].x && newY === this.secondaryFigures[i].y) {
            return;
          }
        }
      }
    }

    arr[index].firstMove = true;

    arr[index].x = newX;
    arr[index].y = newY;

    arr[index].fieldX += xsteps;
    arr[index].fieldY += ysteps;

    document.getElementById(`${id}Figure${index}`).style.left = `${arr[index].x}px`;
    document.getElementById(`${id}Figure${index}`).style.top = `${arr[index].y}px`;
  }

  figuresValidation(index: number, i: number, newPosX: number, newPosY: number, figures: Figure[]): boolean {
    if (index !== 1 && index !== 6) {
      if (index === 0 || index === 7) { //ладья
        return this.rookValidation(index, i, newPosX, newPosY, figures);
      } else if (index === 2 || index === 5) { //слон
        return this.bishopValidation(index, i, newPosX, newPosY, figures);
      } else if (index === 3) { //королева
        return this.rookValidation(index, i, newPosX, newPosY, figures) || this.bishopValidation(index, i, newPosX, newPosY, figures);
      }
    }
  }

  rookValidation(index: number, i: number, newPosX: number, newPosY: number, figures: Figure[]): boolean {
    if (newPosX > this.mainFigures[index].fieldX && newPosY === this.mainFigures[index].fieldY) { //вправо
      if (newPosX > figures[i].fieldX && newPosY === figures[i].fieldY) {
        console.log('can not go right');
        return true;
      }
    } else if (newPosX === this.mainFigures[index].fieldX && newPosY > this.mainFigures[index].fieldY) { //вверх
      if (newPosY > figures[i].fieldY && newPosX === figures[i].fieldX) {
        console.log('can not go up');
        return true;
      }
    } else if (newPosX < this.mainFigures[index].fieldX && newPosY === this.mainFigures[index].fieldY) { //влево
      if (newPosX < figures[i].fieldX && newPosY === figures[i].fieldY) {
        console.log('can not go left');
        return true;
      }
    } else if (newPosX === this.mainFigures[index].fieldX && newPosY < this.mainFigures[index].fieldY) { //вниз
      if (newPosY < figures[i].fieldY && newPosX === figures[i].fieldX) {
        console.log('can not go down');
        return true;
      }
    }
  }

  bishopValidation(index: number, i: number, newPosX: number, newPosY: number, figures: Figure[]): boolean {
    if (newPosX > this.mainFigures[index].fieldX && newPosY > this.mainFigures[index].fieldY) { //северо-восток
      if (figures[i].fieldX === figures[index].fieldX && figures[i].fieldY === figures[index].fieldY) {
        console.log('can not go north-east');
        return true;
      }
    } else if (newPosX < this.mainFigures[index].fieldX && newPosY > this.mainFigures[index].fieldY) { //северо-запад
      if (figures[i].fieldX === figures[index].fieldX && figures[i].fieldY === figures[index].fieldY) {
        console.log('can not go north-west');
        return true;
      }
    } else if (newPosX < this.mainFigures[index].fieldX && newPosY < this.mainFigures[index].fieldY) { //юго-запад
      if (figures[i].fieldX === figures[index].fieldX && figures[i].fieldY === figures[index].fieldY) {
        console.log('can not go south-west');
        return true;
      }
    } else if (newPosX > this.mainFigures[index].fieldX && newPosY < this.mainFigures[index].fieldY) { //юго-восток
      if (figures[i].fieldX === figures[index].fieldX && figures[i].fieldY === figures[index].fieldY) {
        console.log('can not go south-east');
        return true;
      }
    }
  }

  setStyles(i: number, isMain: boolean) {
    let arr: Figure[] = isMain ? this.mainFigures : this.secondaryFigures;

    return {
      'left': `${arr[i].x}px`,
      'top': `${arr[i].y}px`
    };
  }
}
