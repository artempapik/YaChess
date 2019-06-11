//TODO
//сделать, чтобы фигуры "не перескакивали" друг через друга (кроме коня)
//ход не должен выходить за пределы "доски"

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
    //console.log(this.mainFigures);
    //console.log(this.secondaryFigures);

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
      if (xsteps !== 0 || (ysteps !== 1 && ysteps !== 2)) {
        alert('can not');
        return;
      }
    }

    //новые координаты фигуры
    let newX: number = arr[index].x + 50 * xsteps;
    let newY: number = arr[index].y - 40 * ysteps;

    //позиция хода не может совпадать с позициями других своих фигур
    //фигуры не могут "перескакивать" друг через друга (кроме коня)
    if (isMain) { //фигура относится к главным - просматриваем все главные, кроме текущей, и все второстепенные
      for (let i: number = 0; i < this.mainFigures.length; i++) {
        if (index !== i) {
          if (newX === this.mainFigures[i].x && newY === this.mainFigures[i].y) {
            return;
          }

          if (index !== 1 && index !== 6) { //если не конь
            if (index === 0 || index === 7) { //ладья
              if (this.rookValidation(newX, newY, this.mainFigures[index].x, this.mainFigures[index].y, this.mainFigures[i].x, this.mainFigures[i].y)) {
                return;
              }
            } else if (index === 2 || index === 5) { //слон
              if (this.bishopValidation(newX, newY, this.mainFigures[index].fieldX, this.mainFigures[index].fieldY, this.mainFigures[i].fieldX, this.mainFigures[i].fieldY)) {
                return;
              }
            } else if (index === 3) { //королева
              if (this.rookValidation(newX, newY, this.mainFigures[index].x, this.mainFigures[index].y, this.mainFigures[i].x, this.mainFigures[i].y) ||
                  this.bishopValidation(newX, newY, this.mainFigures[index].fieldX, this.mainFigures[index].fieldY, this.mainFigures[i].fieldX, this.mainFigures[i].fieldY)) {
                return;
              }
            }
          }
        }
      }

      for (let i: number = 0; i < this.secondaryFigures.length; i++) {   
        if (newX === this.secondaryFigures[i].x && newY === this.secondaryFigures[i].y) {
          return;
        }

        if (index !== 1 && index !== 6) { //если не конь
          if (index === 0 || index === 7) { //ладья
            if (this.rookValidation(newX, newY, this.secondaryFigures[index].x, this.secondaryFigures[index].y, this.secondaryFigures[i].x, this.secondaryFigures[i].y)) {
              return;
            }
          } else if (index === 2 || index === 5) { //слон
            if (this.bishopValidation(newX, newY, this.secondaryFigures[index].fieldX, this.secondaryFigures[index].fieldY, this.secondaryFigures[i].fieldX, this.secondaryFigures[i].fieldY)) {
              return;
            }
          } else if (index === 3) { //королева
            if (this.rookValidation(newX, newY, this.secondaryFigures[index].x, this.secondaryFigures[index].y, this.secondaryFigures[i].x, this.secondaryFigures[i].y) ||
              this.bishopValidation(newX, newY, this.secondaryFigures[index].fieldX, this.secondaryFigures[index].fieldY, this.secondaryFigures[i].fieldX, this.secondaryFigures[i].fieldY)) {
              return;
            }
          }
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

    arr[index].x = newX;
    arr[index].y = newY;

    arr[index].fieldX += xsteps;
    arr[index].fieldY += ysteps;

    document.getElementById(`${id}Figure${index}`).style.left = `${arr[index].x}px`;
    document.getElementById(`${id}Figure${index}`).style.top = `${arr[index].y}px`;
  }

  rookValidation(newX: number, newY: number, currentX: number, currentY: number, checkX: number, checkY: number): boolean {
    if (newX > currentX && newY === currentY) { //вправо
      if (newX > checkX && newY === checkY) {
        console.log('can not go right');
        return true;
      }
    } else if (newX === currentX && newY < currentY) { //вверх
      if (newY < checkY && newX === checkX) {
        console.log('can not go up');
        return true;
      }
    } else if (newX < currentX && newY === currentY) { //влево
      if (newX < checkX && newY === checkY) {
        console.log('can not go left');
        return true;
      }
    } else if (newX === currentX && newY > currentY) { //вниз
      if (newY > checkY && newX === checkX) {
        console.log('can not go down');
        return true;
      }
    }

    return false;
  }

  bishopValidation(newX: number, newY: number, currentX: number, currentY: number, checkX: number, checkY: number): boolean {
    if (newX > currentX && newY < currentY) { //северо-восток
      if (newX > checkX && newY < checkY && checkY < currentY) {
        if (checkX - currentX === checkY - currentY) {
          console.log('can not go north-east');
          return true;
        }
      }
    } else if (newX < currentX && newY < currentY) { //северо-запад
      if (newX < checkX && newY < checkY) {
        if (Math.abs(checkX - currentX) === checkY - currentY) {
          console.log('can not go north-west');
          return true;
        }
      }
    } else if (newX < currentX && newY > currentY) { //юго-запад
      if (checkX - currentX === checkY - currentY) {
        console.log('can not go south-west');
        return true;
      }
    } else { //юго-восток
      if (checkX - currentX === Math.abs(checkY - currentY)) {
        console.log('can not go south-east');
        return true;
      }
    }

    return false;
  }

  setStyles(i: number, isMain: boolean) {
    let arr: Figure[] = isMain ? this.mainFigures : this.secondaryFigures;

    return {
      'left': `${arr[i].x}px`,
      'top': `${arr[i].y}px`
    };
  }
}
