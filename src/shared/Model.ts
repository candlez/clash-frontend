import { Bounds, Bounded, CornerBounds } from "./Bounds";
import { QuadTree } from "./QuadTree";
import { Animatable, Animation, PlayerAnimation } from "./Display";


export class Model {
    private tree: QuadTree<Player>;

    private selectedPlayer!: Player;

    constructor() {
        this.tree = new QuadTree<Player>(0, 0, 819200);
    }

    addPlayer(player: Player): void {
        this.tree.add(player);
    }

    queryRange(bounds: Bounds): Player[] {
        return this.tree.queryRange(bounds);
    }

    setSelectedPlayer(player: Player): void {
        this.selectedPlayer = player;
    }
    getSelectedPlayer(): Player {
        return this.selectedPlayer;
    }
}

export class Player implements Bounded, Animatable {
    private bounds: Bounds;
    private animations: Animation[];

    constructor(xCoord: number, yCoord: number) {
        this.bounds = new CornerBounds(xCoord, yCoord, 10, 10);
        this.animations = [new PlayerAnimation(this)];
    }

    getBounds(): Bounds {
        return this.bounds;
    }

    gatherAnimations(): Animation[] {
        return this.animations;
    }
}