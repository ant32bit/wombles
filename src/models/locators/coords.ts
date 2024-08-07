import { VectorXY } from "../vector-xy";
import { Rect } from "./rect";

export class Coords extends VectorXY {

    distance(from: Coords): number {
        return Math.sqrt(Math.pow(from.x - this.x, 2) + Math.pow(from.y - this.y, 2));
    }

    within(bounds: Rect): boolean {
        return (this.x >= bounds.x && this.x <= bounds.x + bounds.width && this.y >= bounds.y && this.y <= bounds.y + bounds.height);
    }

    move(deltaX: number, deltaY: number): Coords {
        return new Coords(this.x + deltaX, this.y + deltaY);
    }

    equals(coordB: Coords): boolean {
        return this.x === coordB.x && this.y === coordB.y;
    }

    toString(): string {
        return `(${this.x}, ${this.y})`;
    }
}

