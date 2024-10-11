import { ElementRef } from "@angular/core";
import { Model } from "./Model";

export class Display {
    private canvas;
    private ctx;

    private model;

    constructor(canvas: ElementRef<HTMLCanvasElement>, ctx: CanvasRenderingContext2D, model: Model) {
        this.canvas = canvas;
        this.ctx = ctx;

        this.model = model;
    }
}