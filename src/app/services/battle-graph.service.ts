import { Injectable, ElementRef } from '@angular/core';

import { Display } from '../../shared/Display';
import { Model } from '../../shared/Model';

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

    this.display = new Display(canvas, ctx, this.model);
  }
}
