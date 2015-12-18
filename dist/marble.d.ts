export interface Point {
    time: number;
    value: any;
    order: number;
}
export interface Stream {
    id: string;
    description: string;
    points: Point[];
    parents: string[];
}
export interface newStreamOptions {
    parents?: string[];
    description?: string;
}
export declare class MarbleStream {
    private id;
    private options;
    private from;
    private points;
    constructor(id: string, options: newStreamOptions, from: number);
    add(value: any, order: number): void;
    getData(): Stream;
}
export declare class Marble {
    private from;
    private marble;
    constructor();
    newStream(id: string, options?: newStreamOptions): MarbleStream;
    getStream(id: string): MarbleStream;
    getData(): Stream[];
}
