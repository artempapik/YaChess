export class Figure {
  constructor(
    public id: string,
    public x: number,
    public y: number,
    public coordx: number,
    public coordy: number,
    public firstMove?: boolean
  ) { }
}
