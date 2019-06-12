import { Figure } from '../services/figure';
import { Component } from '@angular/core';

@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})

export class HomeComponent {
  mainFigures: Figure[] = [];
  secondaryFigures: Figure[] = [];
  buttonsToMove: HTMLButtonElement[] = [];

  ngOnInit() {
    let coordx: number = 600;

    for (let i: number = 0; i < 8; i++) {
      this.mainFigures.push(new Figure(i, 0, coordx, 400));
      this.secondaryFigures.push(new Figure(i, 1, coordx, 350));
      coordx += 50;
    }
  }

  createButton(figure: Figure, selectedFigure: Figure, id: string, index: number, xcoord: number, ycoord: number): boolean {
    let newx: number = selectedFigure.x + xcoord / 50;
    let newy: number = selectedFigure.y + ycoord / 50;

    //console.log(`${figure.x} ${figure.y}`);

    if (newx === figure.x && newy === figure.y) {
      return true;
    }

    //console.log(`${figure.x} ${figure.y}`);

    let button = document.createElement("button");
    button.innerHTML = "•";

    let body = document.getElementsByTagName("body")[0];

    button.style.left = `${selectedFigure.coordx + xcoord}px`;
    button.style.top = `${selectedFigure.coordy - ycoord}px`;

    body.appendChild(button);

    let buttonsToMove: HTMLButtonElement[] = this.buttonsToMove;

    button.addEventListener("click", function () {
      document.getElementById(`${id}${index}`).style.left = button.style.left;
      document.getElementById(`${id}${index}`).style.top = button.style.top;

      selectedFigure.coordx += xcoord;
      selectedFigure.coordy -= ycoord;

      selectedFigure.x += xcoord / 50;
      selectedFigure.y += ycoord / 50;

      for (let buttonToMove of buttonsToMove) {
        buttonToMove.remove();
      }

      buttonsToMove.length = 0;
      selectedFigure.firstMove = true;
    });

    buttonsToMove.push(button);
  }

  changePosition(index: number, mainFigure: boolean) {
    let selectedFigure: Figure = mainFigure ? this.mainFigures[index] : this.secondaryFigures[index];
    let id: string = mainFigure ? 'main' : 'secondary';

    for (let buttonToMove of this.buttonsToMove) {
      buttonToMove.remove();
    }

    this.buttonsToMove.length = 0;

    let figures: Figure[] = [];

    for (let figure of this.mainFigures) {
      figures.push(figure);
    }

    for (let figure of this.secondaryFigures) {
      figures.push(figure);
    }

    let indexToDelete = mainFigure ? index : index + 8;
    figures.splice(indexToDelete, 1);
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
