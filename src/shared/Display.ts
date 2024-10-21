import { ElementRef } from "@angular/core";
import { Model, Player } from "./Model";
import { Bounds, CornerBounds, MidPointBounds } from "./Bounds";

export class Display {
    private canvas: ElementRef<HTMLCanvasElement>;
    private ctx: CanvasRenderingContext2D;
    private calibrateSizeFlag: boolean;

    private scale: number;
    private height!: number;
    private width!: number;
    private bgColor: string;

    private model: Model;

    private on: boolean;
    private targetScale: number;
    private lastTime!: number;

    constructor(canvas: ElementRef<HTMLCanvasElement>, ctx: CanvasRenderingContext2D, model: Model) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.calibrateSizeFlag = false;

        this.scale = 1;
        this.targetScale = 1;
        this.calibrateSize();
        this.bgColor = "black";

        this.model = model;

        this.on = false;
    }

    clear(): void {
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.width, this.height);
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fill();    
    }

    private calibrateSize(): void {
        const cssSize = this.canvas.nativeElement.getBoundingClientRect();
        this.height = cssSize.height;
        this.canvas.nativeElement.height = this.height;
        this.width = cssSize.width;
        this.canvas.nativeElement.width = this.width;
    }

    private adjustScale(): void {

    }

    private animateFrame(timeDiff: number): void {
        this.clear();
        let animations: Animation[] = [];
        const playersInFrame = this.model.queryRange(new MidPointBounds(
            this.model.getSelectedPlayer().getBounds().getCenterX(),
            this.model.getSelectedPlayer().getBounds().getCenterY(),
            this.width / this.scale,
            this.height / this.scale
        ));
        for (let i = 0; i < playersInFrame.length; i++) {
            animations = animations.concat(playersInFrame[i].gatherAnimations());
        }
        for (let i = 0; i < playersInFrame.length; i++) {
            animations[i].animateFrame(this.ctx, this.scale, this);
        }
    }

    private animationLoop(time: number): void {
        let timeDiff = this.lastTime ? time - this.lastTime : 16;
        if (this.calibrateSizeFlag) {
            this.calibrateSize();
            this.calibrateSizeFlag = false;
        }
        this.adjustScale();
        this.animateFrame(timeDiff);
        if (this.on) {
            requestAnimationFrame(this.animationLoop.bind(this));
        }
    }

    startAnimationLoop(): void {
        this.on = true;
        requestAnimationFrame(this.animationLoop.bind(this));
    }

    stopAnimationLoop(): void {
        this.on = false;
    }

    calculateCanvasCoords(bounds: Bounds): Bounds {
        const centerX = this.model.getSelectedPlayer().getBounds().getCenterX();
        const centerY = this.model.getSelectedPlayer().getBounds().getCenterY();
        return new CornerBounds(
            (this.width / 2) + ((bounds.getLeft() - centerX) * this.scale),
            ((this.height / 2) - ((bounds.getBottom() - centerY) * this.scale)),
            bounds.getWidth() * this.scale,
            bounds.getHeight() * this.scale
        );
    }

    requestSizeCalibration(): void {
        this.calibrateSizeFlag = true;
    }

    setTargetScale(scale: number): void {
        this.targetScale = scale;
    }
}

export interface Animatable {
    gatherAnimations(): Animation[];
}

export abstract class Animation {

    abstract animateFrame(ctx: CanvasRenderingContext2D, scale: number, display: Display): void;
}

export class PlayerAnimation extends Animation {
    private player: Player;

    constructor(player: Player) {
        super();
        this.player = player;
    }

    override animateFrame(ctx: CanvasRenderingContext2D, scale: number, display: Display): void {
        const bounds = display.calculateCanvasCoords(this.player.getBounds());
        ctx.beginPath();
        ctx.rect(
            bounds.getLeft(),
            bounds.getTop(),
            bounds.getWidth(),
            bounds.getHeight()
        )
        ctx.fillStyle = "crimson";
        ctx.fill();
    }
}