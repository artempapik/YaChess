import { Figure } from '../services/figure';
import { Component } from '@angular/core';

@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})

export class HomeComponent {
  mainFigures: Figure[] = [];
  secondaryFigures: Figure[] = [];

  ngOnInit() {
    let coordx: number = 600;

    for (let i: number = 0; i < 8; i++) {
      this.mainFigures.push(new Figure(i, 0, coordx, 400));
      this.secondaryFigures.push(new Figure(i, 1, coordx, 350));
      coordx += 50;
    }
  }

  changePosition(index: number, mainFigure: boolean) {
    let selectedFigure: Figure = mainFigure ? this.mainFigures[index] : this.secondaryFigures[index];
    let id: string = mainFigure ? 'main' : 'secondary';

    let xsteps: number = +prompt('how much x?');
    let ysteps: number = +prompt('how much y?');

    let newx: number = selectedFigure.x + xsteps;
    let newy: number = selectedFigure.y + ysteps;

    //logic goes here...

    let figures: Figure[] = [];

    for (let figure of this.mainFigures) {
      figures.push(figure);
    }

    for (let figure of this.secondaryFigures) {
      figures.push(figure);
    }

    let indexToDelete = mainFigure ? index : index + 8;
    figures.splice(indexToDelete, 1);

    for (let figure of figures) {
      if (newx === figure.x && newy === figure.y) {
        return;
      }

      if (mainFigure) {
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
            break;
        }
      }
    }

    selectedFigure.firstMove = true;

    selectedFigure.coordx += 50 * xsteps;
    selectedFigure.coordy -= 50 * ysteps;

    selectedFigure.x = newx;
    selectedFigure.y = newy;

    document.getElementById(`${id}${index}`).style.left = `${selectedFigure.coordx}px`;
    document.getElementById(`${id}${index}`).style.top = `${selectedFigure.coordy}px`;
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
      return figure.x > selectedFigure.x && figure.y > selectedFigure.y && figure.x - selectedFigure.x === figure.y - selectedFigure.y;
    } else if (newx < selectedFigure.x && newy > selectedFigure.y) {
      return figure.x < selectedFigure.x && figure.y > selectedFigure.y && Math.abs(figure.x - selectedFigure.x) === figure.y - selectedFigure.y;
    } else if (newx > selectedFigure.x && newy < selectedFigure.y) {
      return figure.x > selectedFigure.x && figure.y < selectedFigure.y && figure.x - selectedFigure.x === Math.abs(figure.y - selectedFigure.y);
    } else if (newx < selectedFigure.x && newy < selectedFigure.y) {
      return figure.x < selectedFigure.x && figure.y < selectedFigure.y && figure.x - selectedFigure.x === figure.y - selectedFigure.y;
    }
  }

  setStyles(i: number, isMain: boolean) {
    let arr: Figure[] = isMain ? this.mainFigures : this.secondaryFigures;

    return {
      'left': `${arr[i].coordx}px`,
      'top': `${arr[i].coordy}px`
    };
  }
}
