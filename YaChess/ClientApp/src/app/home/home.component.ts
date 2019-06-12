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
    const STEP = 50;

    let coordx: number = 600;

    for (let i: number = 0; i < 8; i++) {
      this.mainFigures.push(new Figure(i, 0, coordx, 400));
      this.secondaryFigures.push(new Figure(i, 1, coordx, 350));
      coordx += STEP;
    }
  }

  figures: Figure[] = [];

  createButton(selectedFigure: Figure, id: string, index: number, x: number, y: number) {
    const STEP = 50;

    let newx: number = selectedFigure.x + x;
    let newy: number = selectedFigure.y + y;

    if (newx > 7 || newx < 0 || newy > 7 || newy < 0) {
      return;
    }

    for (let figure of this.figures) {
      if (figure.x === newx && figure.y === newy) {
        return;
      }

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
          if (this.rookValidation(newx, newy, figure, selectedFigure) || this.bishopValidation(newx, newy, figure, selectedFigure) {
            return;
          }
      }
    }

    let button = document.createElement("button");
    button.innerHTML = "•";

    let body = document.getElementsByTagName("body")[0];

    button.style.left = `${selectedFigure.coordx + x * STEP}px`;
    button.style.top = `${selectedFigure.coordy - y * STEP}px`;

    body.appendChild(button);

    let buttonsToMove: HTMLButtonElement[] = this.buttonsToMove;

    button.addEventListener("click", function () {
      document.getElementById(`${id}${index}`).style.left = button.style.left;
      document.getElementById(`${id}${index}`).style.top = button.style.top;

      selectedFigure.coordx += x * STEP;
      selectedFigure.coordy -= y * STEP;

      selectedFigure.x = newx;
      selectedFigure.y = newy;

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

    for (let figure of this.mainFigures) {
      this.figures.push(figure);
    }

    for (let figure of this.secondaryFigures) {
      this.figures.push(figure);
    }

    let indexToDelete = mainFigure ? index : index + 8;
    this.figures.splice(indexToDelete, 1);

    for (let i: number = 1; i < 8; i++) {
      if (mainFigure) {
        switch (index) {
          case 0:
          case 7:
            this.rookSteps(selectedFigure, id, index, i);
            break;
          case 1:
          case 6:
            this.knightSteps(selectedFigure, id, index, i);
            return;
          case 2:
          case 5:
            this.bishopSteps(selectedFigure, id, index, i);
            break;
          case 3:
            this.queenSteps(selectedFigure, id, index, i);
            break;
          case 4:
            this.kingSteps(selectedFigure, id, index, i);
            return;
        }
      } else {
        this.pawnSteps(selectedFigure, id, index, i);
        return;
      }
    }
  }

  queenSteps(selectedFigure: Figure, id: string, index: number, i: number) {
    this.rookSteps(selectedFigure, id, index, i);
    this.bishopSteps(selectedFigure, id, index, i);
  }

  kingSteps(selectedFigure: Figure, id: string, index: number, i: number) {
    this.createButton(selectedFigure, id, index, i, 0);
    this.createButton(selectedFigure, id, index, -i, 0);
    this.createButton(selectedFigure, id, index, 0, i);
    this.createButton(selectedFigure, id, index, 0, -i);
    this.createButton(selectedFigure, id, index, i, i);
    this.createButton(selectedFigure, id, index, i, -i);
    this.createButton(selectedFigure, id, index, -i, i);
    this.createButton(selectedFigure, id, index, -i, -i);
  }

  rookSteps(selectedFigure: Figure, id: string, index: number, i: number) {
    this.createButton(selectedFigure, id, index, i, 0);
    this.createButton(selectedFigure, id, index, -i, 0);
    this.createButton(selectedFigure, id, index, 0, i);
    this.createButton(selectedFigure, id, index, 0, -i);
  }

  bishopSteps(selectedFigure: Figure, id: string, index: number, i: number) {
    this.createButton(selectedFigure, id, index, i, i);
    this.createButton(selectedFigure, id, index, -i, i);
    this.createButton(selectedFigure, id, index, i, -i);
    this.createButton(selectedFigure, id, index, -i, -i);
  }

  knightSteps(selectedFigure: Figure, id: string, index: number, i: number) {
    this.createButton(selectedFigure, id, index, i, i + 1);
    this.createButton(selectedFigure, id, index, -i, i + 1);
    this.createButton(selectedFigure, id, index, i, i - 3);
    this.createButton(selectedFigure, id, index, -i, i - 3);
    this.createButton(selectedFigure, id, index, i + 1, i - 2);
    this.createButton(selectedFigure, id, index, i + 1, i);
    this.createButton(selectedFigure, id, index, i - 3, i);
    this.createButton(selectedFigure, id, index, i - 3, i - 2);
  }

  pawnSteps(selectedFigure: Figure, id: string, index: number, i: number) {
    this.createButton(selectedFigure, id, index, 0, i);

    if (!selectedFigure.firstMove) {
      this.createButton(selectedFigure, id, index, 0, i + 1);
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
