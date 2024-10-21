import { Injectable, ElementRef } from '@angular/core';

import { Display } from '../../shared/Display';
import { Model, Player } from '../../shared/Model';

@Injectable({
  providedIn: 'root'
})
export class BattleGraphService {
  private canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  private model!: Model;

  private display!: Display;

  constructor() { }

  /**
   * gives the service the objects it needs to prepare a display
   * the display will not be turned on yet
   * 
   * @param canvas 
   * @param ctx 
   */
  init(canvas: ElementRef<HTMLCanvasElement>, ctx: CanvasRenderingContext2D): void {
    this.canvas = canvas;
    this.ctx = ctx;

    this.model = new Model();

    const player = new Player(100, 100);
    this.model.addPlayer(player);
    this.model.addPlayer(new Player(200, 200));
    this.model.setSelectedPlayer(player);

    this.display = new Display(canvas, ctx, this.model);
    this.display.startAnimationLoop();
  }

  requestSizeCalibration(): void {
    this.display.requestSizeCalibration();
  }
}
