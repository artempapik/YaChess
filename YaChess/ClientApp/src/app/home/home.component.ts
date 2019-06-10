//TODO
//сделать, чтобы фигуры "не перескакивали" друг через друга (кроме коня)

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

    for (let i: number = 0; i < 8; i++) {
      this.mainFigures.push(new Figure(x, mainY));
      this.secondaryFigures.push(new Figure(x, secondaryY));
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
        if (Math.abs(xsteps - ysteps) !== 1) {
          alert('can not');
          return;
        }
      } else if (index === 2 || index === 5) { //слон
        if (Math.abs(xsteps) !== Math.abs(ysteps)) {
          alert('can not');
          return;
        }
      } else if (index === 4) { //король
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
    //королева - как угодно
    //

    //новые предполагаемые координаты фигуры
    let newX: number = arr[index].x + 50 * xsteps;
    let newY: number = arr[index].y - 40 * ysteps;
    //

    //позиция хода не может совпадать с позициями других своих фигур
    if (isMain) { //фигура относится к главным - просматриваем все главные, кроме текущей, и все второстепенные
      for (let i: number = 0; i < this.mainFigures.length; i++) {
        if (index !== i) {
          if (newX === this.mainFigures[i].x && newY === this.mainFigures[i].y) {
            return;
          }
        }
      }

      for (let i: number = 0; i < this.secondaryFigures.length; i++) {   
        if (newX === this.secondaryFigures[i].x && newY === this.secondaryFigures[i].y) {
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
    //

    arr[index].x = newX;
    arr[index].y = newY;

    document.getElementById(`${id}Figure${index}`).style.left = `${arr[index].x}px`;
    document.getElementById(`${id}Figure${index}`).style.top = `${arr[index].y}px`;
  }

  setStyles(i: number, isMain: boolean) {
    let arr: Figure[] = isMain ? this.mainFigures : this.secondaryFigures;

    return {
      'left': `${arr[i].x}px`,
      'top': `${arr[i].y}px`
    };
  }
}
