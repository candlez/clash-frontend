
export class Bounds {
    private xCoord: number;
    private yCoord: number;
    private width: number;
    private height: number;

    constructor(xCoord: number, yCoord: number, width: number, height: number) {
        this.xCoord = xCoord;
        this.yCoord = yCoord;
        this.width = width;
        this.height = height;
    }

    intersectsBounds(bounds: Bounds): boolean {
        if (this.xCoord >= bounds.getRight() || bounds.getLeft() >= this.getRight()) {
            return false;
        }
        if (this.yCoord >= bounds.getTop() || bounds.getBottom() >= this.getTop()) {
            return false;
        }
        return true;
    }

    containsBounds(bounds: Bounds): boolean {
        return this.containsPoint(bounds.getLeft(), bounds.getBottom()) &&
            this.containsPoint(bounds.getRight() - 1, bounds.getTop() - 1);
    }

    containsPoint(xCoord: number, yCoord: number): boolean {
        return xCoord >= this.xCoord && xCoord < this.getRight() && 
            yCoord >= this.yCoord && yCoord < this.getTop();
    }

    getBottom(): number {
        return this.yCoord;
    }
    getLeft(): number {
        return this.xCoord;
    }
    getTop(): number {
        return this.yCoord + this.height;
    }
    getRight(): number {
        return this.xCoord + this.width;
    }
    getWidth(): number {
        return this.width;
    }
    getHeight(): number {
        return this.height;
    }
    getCenterX(): number {
        return this.xCoord + (this.width / 2);
    }
    getCenterY(): number {
        return this.yCoord + (this.height / 2);
    }
}

export class MidPointBounds extends Bounds {
    constructor(xCoord: number, yCoord: number, width: number, height: number) {
        let halfX = width / 2;
        let halfY = height / 2;
        super(xCoord - halfX, yCoord - halfY, width, height);
    }
}

export class CornerBounds extends Bounds {
    constructor(xCoord: number, yCoord: number, width: number, height: number) {
        super(xCoord, yCoord, width, height);
    }
}

export interface Bounded {
    getBounds(): Bounds;
}