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
    let figure: Figure = mainFigure ? this.mainFigures[index] : this.secondaryFigures[index];
    let id: string = mainFigure ? 'main' : 'secondary';

    let xsteps: number = +prompt('how much x?');
    let ysteps: number = +prompt('how much y?');

    let newx: number = figure.x + xsteps;
    let newy: number = figure.y + ysteps;

    //logic goes here...

    figure.firstMove = true;

    figure.coordx += 50 * xsteps;
    figure.coordy -= 50 * ysteps;

    figure.x = newx;
    figure.y = newy;

    document.getElementById(`${id}${index}`).style.left = `${figure.coordx}px`;
    document.getElementById(`${id}${index}`).style.top = `${figure.coordy}px`;
  }

  setStyles(i: number, isMain: boolean) {
    let arr: Figure[] = isMain ? this.mainFigures : this.secondaryFigures;

    return {
      'left': `${arr[i].coordx}px`,
      'top': `${arr[i].coordy}px`
    };
  }
}
