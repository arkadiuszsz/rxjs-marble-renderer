import { ElementRef, OnInit, OnChanges, SimpleChange } from 'angular2/core';
import { Marble } from './marble';
export declare class MarbleComponent implements OnInit, OnChanges {
    private elementRef;
    width: number;
    height: number;
    marble: Marble;
    constructor(elementRef: ElementRef);
    ngOnInit(): void;
    ngOnChanges(changes: {
        [propName: string]: SimpleChange;
    }): void;
}
