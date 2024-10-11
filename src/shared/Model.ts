import { QuadTree } from "./QuadTree";


export class Model {
    private tree: QuadTree;

    constructor() {
        this.tree = new QuadTree();
    }
}