'use strict'
import {Component, View, OnInit} from 'angular2/core';
import {FORM_DIRECTIVES} from 'angular2/common';
import * as Rx from 'rxjs/Rx';
import {Marble, MarbleComponent} from 'rxjs-marble-renderer';
import 'rxjs-marble-renderer/dist/marble-component.css!';

console.log('index.ts..()', MarbleComponent);

@Component({
	selector: 'rxjs-marbles-sample'
})
@View({
	template: `
	<marble-component width="800" height="450" [marble]="marble"></marble-component>
	<div>
		<select [(ngModel)]="combine">
			<option value="zipAll">Zip</option>
			<option value="combineAll">Combine</option>
			<option value="mergeAll">Merge</option>
			<option value="concatAll">Concat</option>
		</select>
		<button (click)="refreshData()">Refresh Marble Data</button>
	</div>
	`,
	directives: [[MarbleComponent], FORM_DIRECTIVES]
})
export class Index implements OnInit {
	marble:Marble;

	private _combine:string = 'combineAll';

	get combine():string {
		return this._combine;
	}

	set combine(value:string) {
		if (this._combine == value) return;
		this._combine = value;
		this.refreshData();
	}

	ngOnInit() {
		this.refreshData();
	}

	refreshData() {
		console.log(this.combine, Marble);

		let order:number = 0;
		let marble:Marble = new Marble;
		const duration:number = 1000 * 0.1;

		marble.newStream('combined', {description: 'Combined', parents: ['1', 'a', 'A']});

		let observable = Rx.Observable.of<string>('1', 'a', 'A')
			.do((x:string) => marble.newStream(x, {description: `${x}`}))
			.map<number>((x:string) => x.charCodeAt(0))
			.map<Rx.Observable<any>>((x:number) => {
				return Rx.Observable.concat(
					Rx.Observable.of(String.fromCharCode(x)).delay(Math.random() * duration),
					Rx.Observable.of(String.fromCharCode(x + 1)).delay(Math.random() * duration),
					Rx.Observable.of(String.fromCharCode(x + 2)).delay(Math.random() * duration)
					)
					.do(x => marble.getStream(x).add(x, order++)) // collect marble
			})

		observable[this.combine]()
		//.zipAll()
		//.combineAll()
		//.mergeAll()
		//.concatAll()
			.do(x => marble.getStream('combined').add(x, order++)) // collect marble
			.subscribe(
				null,
				e => console.log(`error: ${e}`),
				() => this.marble = marble
			)
	}
}