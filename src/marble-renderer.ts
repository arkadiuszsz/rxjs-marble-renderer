'use strict'
import {Stream, Point} from "./marble";
import d3tip from 'd3tip';

export function render(svgElement:SVGSVGElement, marble:Stream[]) {
	const padding:number = 20;

	const canvas = d3.select(svgElement);
	const canvasWidth:number = Number(canvas.attr('width'));
	const canvasHeight:number = Number(canvas.attr('height'));
	const length:number = marble.length;
	const width:number = canvasWidth - (padding * 2);
	const height:number = Math.floor(canvasHeight / length);
	const middle:number = Math.floor(height / 2);
	const tmin:number = d3.min(marble, (stream:Stream) => d3.min(stream.points, (point:Point) => point.time));
	const tmax:number = d3.max(marble, (stream:Stream) => d3.max(stream.points, (point:Point) => point.time));

	function tpos(t:number, width:number) {
		return (t - tmin) / (tmax - tmin) * width
	}

	canvas.selectAll('*').remove();

	marble.forEach(x => console.log(JSON.stringify(x)));

	let streams:d3.Selection<Stream>;
	let points:d3.Selection<Point>;

	let canvasPoint:SVGPoint = svgElement.createSVGPoint();

	canvas
		.classed('marble', true)

	streams = canvas
		.selectAll('g')
		.data<Stream>(marble)
		.enter()
		.append('g')
		.classed('stream', true)
		.classed('stream-combined', (s:Stream) => s.parents && s.parents.length > 0)
		.attr('transform', (s:Stream, i:number) => `translate(${padding} ${i * height})`)
		.attr('stream-id', (s:Stream) => s.id)

	streams
		.append('line')
		.classed('stream-line', true)
		.attr({
			'x1': 0,
			'x2': width,
			'y1': middle,
			'y2': middle
		})

	streams
		.append('text')
		.classed('stream-description', true)
		.text((s:Stream) => s.description)
		.attr({
			'y': middle
		})

	streams
		.filter((s:Stream) => s.parents && s.parents.length > 0)
		.append('text')
		.classed('stream-combined-info', true)
		.text((s:Stream) => s.parents.join(' + '))
		.attr({
			'y': middle
		})


	points = streams
		.selectAll('g')
		.data<Point>((s:Stream) => s.points)
		.enter()
		.append('g')
		.classed('point', true)
		.attr('transform', (p:Point) => `translate(${tpos(p.time, width)} ${middle})`)
		.attr('point-value', (p:Point) => p.value)


	points
		.append('circle')
		.classed('point-circle', true)
		.attr({
			'r': 3
		})

	points
		.append('text')
		.classed('point-label', true)
		.text((p:Point) => (p.value.toString().length > 4) ? '...' : p.value.toString())

	points
		.append('circle')
		.classed('point-hit', true)
		.attr({
			'r': 6
		})
		.call(d3tip<Point>({
			formatter: (d:Point, i, o) => `${d.value}`
		}))

	points
		.append('circle')
		.classed('point-focus', true)
		.attr({
			'r': 9
		})

	points
		.call((selection:d3.Selection<Point>) => {
			interface Pointer {
				f:number;
				s:number;
				o:number;
				p?:SVGPoint;
			}

			let items:Pointer[] = []
			selection.each((p:Point, s:number, f:number) => items.push({o: p.order, f, s}))

			let points:SVGPoint[] = items
				.sort((a:Pointer, b:Pointer) => a.o - b.o)
				.map((p:Pointer) => canvasPoint.matrixTransform((selection[p.f][p.s] as SVGGElement).getCTM()))

			let lineFunction = d3.svg.line<SVGPoint>()
				.x((p:SVGPoint) => p.x)
				.y((p:SVGPoint) => p.y)
				.interpolate('monotone')

			canvas
				.insert('path', ':first-child')
				.classed('sequence-line', true)
				.attr('d', lineFunction(points))
		})
}