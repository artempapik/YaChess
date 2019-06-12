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

    if (newx === figure.x && newy === figure.y) {
      //console.log(`${newx} ${newy}`);
      //console.log(`${figure.x} ${figure.y}`);
      return true;
    } else {
      //console.log(`a`);
      //console.log(`${newx} ${newy}`);
      //console.log(`${figure.x} ${figure.y}`);
      //console.log(`a`);
    }

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
    let newcoordx: number = 0;
    let newcoordy: number = 0;

    let newx: number = 0;
    let newy: number = 0;

    //

    let selectedFigure: Figure = mainFigure ? this.mainFigures[index] : this.secondaryFigures[index];
    let id: string = mainFigure ? 'main' : 'secondary';

    for (let buttonToMove of this.buttonsToMove) {
      buttonToMove.remove();
    }

    this.buttonsToMove.length = 0;

     //if (newx > 7 || newy > 7 || newx < 0 || newy < 0) {
    //  return;
    //}

    //

    let figures: Figure[] = [];

    for (let figure of this.mainFigures) {
      figures.push(figure);
    }

    for (let figure of this.secondaryFigures) {
      figures.push(figure);
    }

    let indexToDelete = mainFigure ? index : index + 8;
    figures.splice(indexToDelete, 1);

    //for (let figure of figures) {
    //  if (mainFigure) {
    //    switch (index) {
    //      case 0:
    //      case 7:
    //        for (let i: number = 0; i < 7; i++) {
    //          //
    //          newcoordx = 50 * (i + 1);
    //          newcoordy = 0;

    //          newx = selectedFigure.x + newcoordx / 50;
    //          newy = selectedFigure.y + newcoordy / 50;

    //          //console.log(`${selectedFigure.x} ${newx}`);
    //          //console.log(`${selectedFigure.y} ${newy}`);
    //          //console.log('\n');

              

    //          this.createButton(figure, selectedFigure, id, index, newcoordx, newcoordy);
              

    //          //

    //          //
    //          newcoordx = -50 * (i + 1);
    //          newcoordy = 0;

    //          newx = selectedFigure.x + newcoordx / 50;
    //          newy = selectedFigure.y + newcoordy / 50;

             
    //          //this.createButton(figure, selectedFigure, id, index, newcoordx, newcoordy);
            
    //          //

    //          //
    //          newcoordx = 0;
    //          newcoordy = 50 * (i + 1);

    //          newx = selectedFigure.x + newcoordx / 50;
    //          newy = selectedFigure.y + newcoordy / 50;

           
    //          //this.createButton(figure, selectedFigure, id, index, newcoordx, newcoordy);
          
    //          //

    //          //
    //          newcoordx = 0;
    //          newcoordy = -50 * (i + 1);

    //          newx = selectedFigure.x + newcoordx / 50;
    //          newy = selectedFigure.y + newcoordy / 50;

             
    //          //this.createButton(figure, selectedFigure, id, index, newcoordx, newcoordy);
      
    //          //
    //        }

    //        //if (this.rookValidation(newx, newy, figure, selectedFigure)) {
    //        //  return;
    //        //}
    //        break;
    //      case 2:
    //      case 5:
    //        //if (this.bishopValidation(newx, newy, figure, selectedFigure)) {
    //        //  return;
    //        //}
    //        break;
    //      case 3:
    //        //if (this.rookValidation(newx, newy, figure, selectedFigure) || this.bishopValidation(newx, newy, figure, selectedFigure)) {
    //        //  return;
    //        //}
    //        break;
    //    }
    //  } else {
    //    if (selectedFigure.firstMove) {
    //      this.createButton(figure, selectedFigure, id, index, 0, 50);
    //    } else {
    //      this.createButton(figure, selectedFigure, id, index, 0, 50);
    //      this.createButton(figure, selectedFigure, id, index, 0, 100);
    //    }
    //  }
    //}
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
