'use strict';
var MarbleStream = (function () {
    function MarbleStream(id, options, from) {
        this.id = id;
        this.options = options;
        this.from = from;
        this.points = [];
    }
    MarbleStream.prototype.add = function (value, order) {
        var time = +new Date - this.from;
        console.log(this.id + ".add(" + value + ") \u2190 " + time);
        if (value instanceof Array)
            value = value.slice();
        this.points.push({ time: time, value: value, order: order });
    };
    MarbleStream.prototype.getData = function () {
        var id = this.id;
        var points = this.points;
        var description = this.options.description || this.id;
        var parents = this.options.parents || null;
        return { id: id, points: points, description: description, parents: parents };
    };
    return MarbleStream;
})();
exports.MarbleStream = MarbleStream;
var Marble = (function () {
    function Marble() {
        this.from = +new Date;
        this.marble = {};
    }
    Marble.prototype.newStream = function (id, options) {
        if (options === void 0) { options = {}; }
        if (this.marble[id] !== undefined)
            return;
        this.marble[id] = new MarbleStream(id, options, this.from);
    };
    Marble.prototype.getStream = function (id) {
        if (this.marble[id] === undefined) {
            var code = id.charCodeAt(0);
            while (this.marble[String.fromCharCode(--code)] === undefined) {
            }
            id = String.fromCharCode(code);
        }
        return this.marble[id];
    };
    Marble.prototype.getData = function () {
        var streams = [];
        for (var id in this.marble) {
            if (!this.marble.hasOwnProperty(id))
                continue;
            streams.push(this.marble[id].getData());
        }
        streams.sort(function (a, b) {
            if (b.parents && b.parents.indexOf(a.id) > -1) {
                return -1;
            }
            else if (a.parents && a.parents.indexOf(b.id) > -1) {
                return 1;
            }
            return 0;
        });
        return streams;
    };
    return Marble;
})();
exports.Marble = Marble;
//# sourceMappingURL=marble.js.map