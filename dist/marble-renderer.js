'use strict';
var d3tip_1 = require('d3tip');
function render(svgElement, marble) {
    var padding = 20;
    var canvas = d3.select(svgElement);
    var canvasWidth = Number(canvas.attr('width'));
    var canvasHeight = Number(canvas.attr('height'));
    var length = marble.length;
    var width = canvasWidth - (padding * 2);
    var height = Math.floor(canvasHeight / length);
    var middle = Math.floor(height / 2);
    var tmin = d3.min(marble, function (stream) { return d3.min(stream.points, function (point) { return point.time; }); });
    var tmax = d3.max(marble, function (stream) { return d3.max(stream.points, function (point) { return point.time; }); });
    function tpos(t, width) {
        return (t - tmin) / (tmax - tmin) * width;
    }
    canvas.selectAll('*').remove();
    marble.forEach(function (x) { return console.log(JSON.stringify(x)); });
    var streams;
    var points;
    var canvasPoint = svgElement.createSVGPoint();
    canvas
        .classed('marble', true);
    streams = canvas
        .selectAll('g')
        .data(marble)
        .enter()
        .append('g')
        .classed('stream', true)
        .classed('stream-combined', function (s) { return s.parents && s.parents.length > 0; })
        .attr('transform', function (s, i) { return ("translate(" + padding + " " + i * height + ")"); })
        .attr('stream-id', function (s) { return s.id; });
    streams
        .append('line')
        .classed('stream-line', true)
        .attr({
        'x1': 0,
        'x2': width,
        'y1': middle,
        'y2': middle
    });
    streams
        .append('text')
        .classed('stream-description', true)
        .text(function (s) { return s.description; })
        .attr({
        'y': middle
    });
    streams
        .filter(function (s) { return s.parents && s.parents.length > 0; })
        .append('text')
        .classed('stream-combined-info', true)
        .text(function (s) { return s.parents.join(' + '); })
        .attr({
        'y': middle
    });
    points = streams
        .selectAll('g')
        .data(function (s) { return s.points; })
        .enter()
        .append('g')
        .classed('point', true)
        .attr('transform', function (p) { return ("translate(" + tpos(p.time, width) + " " + middle + ")"); })
        .attr('point-value', function (p) { return p.value; });
    points
        .append('circle')
        .classed('point-circle', true)
        .attr({
        'r': 3
    });
    points
        .append('text')
        .classed('point-label', true)
        .text(function (p) { return p.value; });
    points
        .append('circle')
        .classed('point-hit', true)
        .attr({
        'r': 6
    })
        .call(d3tip_1.default({
        formatter: function (d, i, o) { return ("" + d.value); }
    }));
    points
        .append('circle')
        .classed('point-focus', true)
        .attr({
        'r': 9
    });
    points
        .call(function (selection) {
        var items = [];
        selection.each(function (p, s, f) { return items.push({ o: p.order, f: f, s: s }); });
        var points = items
            .sort(function (a, b) { return a.o - b.o; })
            .map(function (p) { return canvasPoint.matrixTransform(selection[p.f][p.s].getCTM()); });
        var lineFunction = d3.svg.line()
            .x(function (p) { return p.x; })
            .y(function (p) { return p.y; })
            .interpolate('monotone');
        canvas
            .insert('path', ':first-child')
            .classed('sequence-line', true)
            .attr('d', lineFunction(points));
    });
}
exports.render = render;
//# sourceMappingURL=marble-renderer.js.map