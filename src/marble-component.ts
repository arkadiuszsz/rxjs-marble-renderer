'use strict'
import {Component, View, ElementRef, OnInit, Input, OnChanges, SimpleChange} from 'angular2/core';
import {Marble} from './marble';
import {render} from './marble-renderer';

@Component({
	selector: 'marble-component'
})
@View({
	template: `<svg [attr.width]="width" [attr.height]="height"></svg>`
})
export class MarbleComponent implements OnInit, OnChanges {
	@Input() width:number = 600;
	@Input() height:number = 450;
	@Input() marble:Marble;

	constructor(private elementRef:ElementRef) {
	}
	
	ngOnInit() {
	}

	ngOnChanges(changes:{[propName:string]:SimpleChange}) {
		if (changes.hasOwnProperty('marble') && changes['marble'].currentValue) {
			render(this.elementRef.nativeElement.firstChild, changes['marble'].currentValue.getData());
		}
	}
}