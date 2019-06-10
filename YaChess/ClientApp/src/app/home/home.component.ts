import { Component } from '@angular/core';
import { Figure } from '../services/figure';

@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})

export class HomeComponent {
  y: number = 100;

  mainFigures: Figure[] = [];
  secondaryFigures: Figure[] = [];

  ngOnInit() {
    let x: number = 100;
    let y: number = 60;

    for (let i: number = 0; i < 8; i++) {
      this.mainFigures.push(new Figure(x, this.y));
      this.secondaryFigures.push(new Figure(x, y));
      x += 50;
    }
  }

  changePosition1(i: number) {
    document.getElementById(`mainFigure${i}`).style.left = `${--this.mainFigures[i].x}px`;
  }

  changePosition2(i: number) {
    document.getElementById(`secondaryFigure${i}`).style.left = `${--this.secondaryFigures[i].x}px`;
  }

  setStyles1(i: number) {
    return {
      'left': `${this.mainFigures[i].x}px`,
      'top': `${this.mainFigures[i].y}px`
    };
  }

  setStyles2(i: number) {
    return {
      'left': `${this.secondaryFigures[i].x}px`,
      'top': `${this.secondaryFigures[i].y}px`
    };
  }
}
