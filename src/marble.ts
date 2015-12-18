'use strict'

export interface Point {
	time: number;
	value: any;
	order: number;
}

export interface Stream {
	id:string;
	description:string;
	points:Point[];
	parents:string[];
}

export interface newStreamOptions {
	parents?:string[];
	description?:string;
}

export class MarbleStream {
	private points:Point[];

	constructor(private id:string, private options:newStreamOptions, private from:number) {
		this.points = [];
	}

	add(value:any, order:number) {
		let time:number = +new Date - this.from;
		console.log(`${this.id}.add(${value}) ← ${time}`);
		if (value instanceof Array) value = value.slice();
		this.points.push({time, value, order});
	}

	getData():Stream {
		let id:string = this.id;
		let points:Point[] = this.points;
		let description:string = this.options.description || this.id;
		let parents:string[] = this.options.parents || null;
		return {id, points, description, parents};
	}
}

export class Marble {
	private from:number;
	private marble:{[name:string]: MarbleStream};

	constructor() {
		this.from = +new Date;
		this.marble = {};
	}

	newStream(id:string, options:newStreamOptions = {}):MarbleStream {
		if (this.marble[id] !== undefined) return;
		this.marble[id] = new MarbleStream(id, options, this.from);
	}

	getStream(id:string):MarbleStream {
		if (this.marble[id] === undefined) {
			let code:number = id.charCodeAt(0);
			while (this.marble[String.fromCharCode(--code)] === undefined) {
			}
			id = String.fromCharCode(code);
		}
		return this.marble[id];
	}

	getData():Stream[] {
		let streams:Stream[] = [];
		for (let id in this.marble) {
			if (!this.marble.hasOwnProperty(id)) continue;
			streams.push(this.marble[id].getData());
		}
		streams.sort((a:Stream, b:Stream) => {
			if (b.parents && b.parents.indexOf(a.id) > -1) {
				return -1;
			} else if (a.parents && a.parents.indexOf(b.id) > -1) {
				return 1;
			}
			return 0;
		});
		return streams;
	}
}











