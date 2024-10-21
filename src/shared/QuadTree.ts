import { Bounds, Bounded, MidPointBounds } from "./Bounds";

export class QuadTree<T extends Bounded> {
    private root: QTNode<T>;

    private static MAX_DEPTH = 10;

    constructor(xCoord: number, yCoord: number, size: number) {
        this.root = new QTNode<T>(xCoord, yCoord, size);
    }

    add(item: T): void {
        const itemBounds = item.getBounds();
        if (!this.root.getBounds().containsBounds(itemBounds)) {
            throw new Error("item must fit within the QuadTree to be added");
        }
        let curr = this.root;
        let depth = 1;
        while (depth != QuadTree.MAX_DEPTH) {
            const quad1 = curr.getQuadrant(itemBounds.getLeft(), itemBounds.getTop());
            const quad2 = curr.getQuadrant(itemBounds.getRight() - 1, itemBounds.getBottom() - 1);
            if (quad1 !== quad2 || quad1 === Quadrant.ON_AXIS) {
                break;
            } else {
                if (curr.isLeaf()) {
                    curr.split();
                }
                curr = curr.getNodeByQuadrant(quad1)!;
            }
            depth += 1;
        }
        curr.insert(item);
    }

    removeItem(item: T): void {
        // I'll write this when I need it
    }

    removeInBounds(bounds: Bounds): Bounds[] {
        // I'll write this when I need it
        return [];
    }

    queryRange(bounds: Bounds): T[] {
        let res: T[] = [];
        this.queryRangeHelperIntersecting(this.root, bounds, res);
        return res;
    }

    private checkNode(node: QTNode<T>, bounds: Bounds, arr: T[]): void {
        const items = node.getItems();
        for (let i = 0; i < items.length; i++) {
            if (bounds.intersectsBounds(items[i].getBounds())) {
                arr.push(items[i]);
            }
        }
    }

    // use this when the bounds only intersects the node
    private queryRangeHelperIntersecting(node: QTNode<T>, bounds: Bounds, arr: T[]): void {
        this.checkNode(node, bounds, arr);
        if (!node.isLeaf()) {
            const nw = node.getNorthWest()!;
            if (bounds.containsBounds(nw.getBounds())) {
                this.queryRangeHelperContaining(nw, bounds, arr);
            } else if (bounds.intersectsBounds(nw.getBounds())) {
                this.queryRangeHelperIntersecting(nw, bounds, arr)
            }
            const ne = node.getNorthEast()!;
            if (bounds.containsBounds(ne.getBounds())) {
                this.queryRangeHelperContaining(ne, bounds, arr);
            } else if (bounds.intersectsBounds(ne.getBounds())) {
                this.queryRangeHelperIntersecting(ne, bounds, arr)
            }
            const se = node.getSouthEast()!;
            if (bounds.containsBounds(se.getBounds())) {
                this.queryRangeHelperContaining(se, bounds, arr);
            } else if (bounds.intersectsBounds(se.getBounds())) {
                this.queryRangeHelperIntersecting(se, bounds, arr)
            }
            const sw = node.getSouthWest()!;
            if (bounds.containsBounds(sw.getBounds())) {
                this.queryRangeHelperContaining(sw, bounds, arr);
            } else if (bounds.intersectsBounds(sw.getBounds())) {
                this.queryRangeHelperIntersecting(sw, bounds, arr)
            }
        }
    }

    // use this when the bounds entirely contains the node
    private queryRangeHelperContaining(node: QTNode<T>, bounds: Bounds, arr: T[]): void {
        this.checkNode(node, bounds, arr);
        if (!node.isLeaf()) {
            this.queryRangeHelperContaining(node.getNorthWest()!, bounds, arr);
            this.queryRangeHelperContaining(node.getNorthEast()!, bounds, arr);
            this.queryRangeHelperContaining(node.getSouthEast()!, bounds, arr);
            this.queryRangeHelperContaining(node.getSouthWest()!, bounds, arr);
        }
    }
}

class QTNode<T extends Bounded> implements Bounded {
    private items: T[];
    private bounds: Bounds;

    private northWest!: QTNode<T> | undefined;
    private northEast!: QTNode<T> | undefined;
    private southEast!: QTNode<T> | undefined;
    private southWest!: QTNode<T> | undefined;

    constructor(xCoord: number, yCoord: number, width: number) {
        this.items = [];
        this.bounds = new MidPointBounds(xCoord, yCoord, width, width);
    }

    isLeaf(): boolean {
        return this.northWest === undefined;
    }

    leafify(): void {
        this.northWest = undefined;
        this.northEast = undefined;
        this.southEast = undefined;
        this.southWest = undefined;
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    removeByReference(item: T): void {
        var index = -1;
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i] === item) {
                index = i;
                break;
            }
        }
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }

    getQuadrant(xCoord: number, yCoord: number): Quadrant {
        const centerX = this.bounds.getCenterX();
        const centerY = this.bounds.getCenterY();
        if (xCoord < centerX) {
            if (yCoord < centerY) {
                return Quadrant.SOUTH_WEST;
            } else if (yCoord > centerY) {
                return Quadrant.NORTH_WEST;
            }
        } else if (xCoord > centerX) {
            if (yCoord < centerY) {
                return Quadrant.SOUTH_EAST;
            } else if (yCoord > centerY) {
                return Quadrant.NORTH_EAST;
            }
        }
        return Quadrant.ON_AXIS;
    }

    insert(item: T): void {
        this.items.push(item);
    }

    split(): void {
        const centerX = this.bounds.getCenterX();
        const centerY = this.bounds.getCenterY();
        const half = this.bounds.getWidth() / 2;
        const quarter = half / 2;

        this.northWest = new QTNode(centerX - quarter, centerY + quarter, half);
        this.northEast = new QTNode(centerX + quarter, centerY + quarter, half);
        this.southEast = new QTNode(centerX + quarter, centerY - quarter, half);
        this.southWest = new QTNode(centerX - quarter, centerY - quarter, half);
    }

    getNodeByQuadrant(quadrant: Quadrant): QTNode<T> | undefined {
        switch (quadrant) {
            case Quadrant.NORTH_WEST:
                return this.northWest;
            case Quadrant.NORTH_EAST:
                return this.northEast;
            case Quadrant.SOUTH_EAST:
                return this.southEast;
            case Quadrant.SOUTH_WEST:
                return this.southWest;
            default:
                return undefined;
        }
    }

    getItems(): T[] {
        return this.items;
    }
    getNorthWest(): QTNode<T> | undefined {
        return this.northWest;
    }
    getNorthEast(): QTNode<T> | undefined {
        return this.northEast;
    }
    getSouthEast(): QTNode<T> | undefined {
        return this.southEast;
    }
    getSouthWest(): QTNode<T> | undefined {
        return this.southWest;
    }
    getBounds(): Bounds {
        return this.bounds;
    }
}

enum Quadrant {
    ON_AXIS,
    NORTH_WEST,
    NORTH_EAST,
    SOUTH_EAST,
    SOUTH_WEST
}