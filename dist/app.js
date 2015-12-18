System.register("app/main/main.models.ts", [], function(exports_1) {
    'use strict';
    var SampleModel;
    return {
        setters:[],
        execute: function() {
            SampleModel = (function () {
                function SampleModel() {
                }
                return SampleModel;
            })();
            exports_1("SampleModel", SampleModel);
        }
    }
});

System.registerDynamic("npm:rxjs-marble-renderer@0.0.2/dist/marble", [], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var MarbleStream = (function() {
    function MarbleStream(id, options, from) {
      this.id = id;
      this.options = options;
      this.from = from;
      this.points = [];
    }
    MarbleStream.prototype.add = function(value, order) {
      var time = +new Date - this.from;
      console.log(this.id + ".add(" + value + ") \u2190 " + time);
      if (value instanceof Array)
        value = value.slice();
      this.points.push({
        time: time,
        value: value,
        order: order
      });
    };
    MarbleStream.prototype.getData = function() {
      var id = this.id;
      var points = this.points;
      var description = this.options.description || this.id;
      var parents = this.options.parents || null;
      return {
        id: id,
        points: points,
        description: description,
        parents: parents
      };
    };
    return MarbleStream;
  })();
  exports.MarbleStream = MarbleStream;
  var Marble = (function() {
    function Marble() {
      this.from = +new Date;
      this.marble = {};
    }
    Marble.prototype.newStream = function(id, options) {
      if (options === void 0) {
        options = {};
      }
      if (this.marble[id] !== undefined)
        return;
      this.marble[id] = new MarbleStream(id, options, this.from);
    };
    Marble.prototype.getStream = function(id) {
      if (this.marble[id] === undefined) {
        var code = id.charCodeAt(0);
        while (this.marble[String.fromCharCode(--code)] === undefined) {}
        id = String.fromCharCode(code);
      }
      return this.marble[id];
    };
    Marble.prototype.getData = function() {
      var streams = [];
      for (var id in this.marble) {
        if (!this.marble.hasOwnProperty(id))
          continue;
        streams.push(this.marble[id].getData());
      }
      streams.sort(function(a, b) {
        if (b.parents && b.parents.indexOf(a.id) > -1) {
          return -1;
        } else if (a.parents && a.parents.indexOf(b.id) > -1) {
          return 1;
        }
        return 0;
      });
      return streams;
    };
    return Marble;
  })();
  exports.Marble = Marble;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("npm:rxjs-marble-renderer@0.0.2/dist/marble-renderer", ["npm:d3tip@0.3.2"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var d3tip_1 = $__require('npm:d3tip@0.3.2');
  function render(svgElement, marble) {
    var padding = 20;
    var canvas = d3.select(svgElement);
    var canvasWidth = Number(canvas.attr('width'));
    var canvasHeight = Number(canvas.attr('height'));
    var length = marble.length;
    var width = canvasWidth - (padding * 2);
    var height = Math.floor(canvasHeight / length);
    var middle = Math.floor(height / 2);
    var tmin = d3.min(marble, function(stream) {
      return d3.min(stream.points, function(point) {
        return point.time;
      });
    });
    var tmax = d3.max(marble, function(stream) {
      return d3.max(stream.points, function(point) {
        return point.time;
      });
    });
    function tpos(t, width) {
      return (t - tmin) / (tmax - tmin) * width;
    }
    canvas.selectAll('*').remove();
    marble.forEach(function(x) {
      return console.log(JSON.stringify(x));
    });
    var streams;
    var points;
    var canvasPoint = svgElement.createSVGPoint();
    canvas.classed('marble', true);
    streams = canvas.selectAll('g').data(marble).enter().append('g').classed('stream', true).classed('stream-combined', function(s) {
      return s.parents && s.parents.length > 0;
    }).attr('transform', function(s, i) {
      return ("translate(" + padding + " " + i * height + ")");
    }).attr('stream-id', function(s) {
      return s.id;
    });
    streams.append('line').classed('stream-line', true).attr({
      'x1': 0,
      'x2': width,
      'y1': middle,
      'y2': middle
    });
    streams.append('text').classed('stream-description', true).text(function(s) {
      return s.description;
    }).attr({'y': middle});
    streams.filter(function(s) {
      return s.parents && s.parents.length > 0;
    }).append('text').classed('stream-combined-info', true).text(function(s) {
      return s.parents.join(' + ');
    }).attr({'y': middle});
    points = streams.selectAll('g').data(function(s) {
      return s.points;
    }).enter().append('g').classed('point', true).attr('transform', function(p) {
      return ("translate(" + tpos(p.time, width) + " " + middle + ")");
    }).attr('point-value', function(p) {
      return p.value;
    });
    points.append('circle').classed('point-circle', true).attr({'r': 3});
    points.append('text').classed('point-label', true).text(function(p) {
      return p.value;
    });
    points.append('circle').classed('point-hit', true).attr({'r': 6}).call(d3tip_1.default({formatter: function(d, i, o) {
        return ("" + d.value);
      }}));
    points.append('circle').classed('point-focus', true).attr({'r': 9});
    points.call(function(selection) {
      var items = [];
      selection.each(function(p, s, f) {
        return items.push({
          o: p.order,
          f: f,
          s: s
        });
      });
      var points = items.sort(function(a, b) {
        return a.o - b.o;
      }).map(function(p) {
        return canvasPoint.matrixTransform(selection[p.f][p.s].getCTM());
      });
      var lineFunction = d3.svg.line().x(function(p) {
        return p.x;
      }).y(function(p) {
        return p.y;
      }).interpolate('monotone');
      canvas.insert('path', ':first-child').classed('sequence-line', true).attr('d', lineFunction(points));
    });
  }
  exports.render = render;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("npm:rxjs-marble-renderer@0.0.2/dist/marble-component", ["npm:angular2@2.0.0-beta.0/core", "npm:rxjs-marble-renderer@0.0.2/dist/marble", "npm:rxjs-marble-renderer@0.0.2/dist/marble-renderer"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d = decorators[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var __metadata = (this && this.__metadata) || function(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
  var core_1 = $__require('npm:angular2@2.0.0-beta.0/core');
  var marble_1 = $__require('npm:rxjs-marble-renderer@0.0.2/dist/marble');
  var marble_renderer_1 = $__require('npm:rxjs-marble-renderer@0.0.2/dist/marble-renderer');
  var MarbleComponent = (function() {
    function MarbleComponent(elementRef) {
      this.elementRef = elementRef;
      this.width = 600;
      this.height = 450;
    }
    MarbleComponent.prototype.ngOnInit = function() {};
    MarbleComponent.prototype.ngOnChanges = function(changes) {
      if (changes.hasOwnProperty('marble') && changes['marble'].currentValue) {
        marble_renderer_1.render(this.elementRef.nativeElement.firstChild, changes['marble'].currentValue.getData());
      }
    };
    __decorate([core_1.Input(), __metadata('design:type', Number)], MarbleComponent.prototype, "width", void 0);
    __decorate([core_1.Input(), __metadata('design:type', Number)], MarbleComponent.prototype, "height", void 0);
    __decorate([core_1.Input(), __metadata('design:type', marble_1.Marble)], MarbleComponent.prototype, "marble", void 0);
    MarbleComponent = __decorate([core_1.Component({selector: 'marble-component'}), core_1.View({template: "<svg [attr.width]=\"width\" [attr.height]=\"height\"></svg>"}), __metadata('design:paramtypes', [core_1.ElementRef])], MarbleComponent);
    return MarbleComponent;
  })();
  exports.MarbleComponent = MarbleComponent;
  global.define = __define;
  return module.exports;
});

System.registerDynamic("npm:rxjs-marble-renderer@0.0.2/dist/index", ["npm:rxjs-marble-renderer@0.0.2/dist/marble", "npm:rxjs-marble-renderer@0.0.2/dist/marble-renderer", "npm:rxjs-marble-renderer@0.0.2/dist/marble-component"], true, function($__require, exports, module) {
  "use strict";
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  function __export(m) {
    for (var p in m)
      if (!exports.hasOwnProperty(p))
        exports[p] = m[p];
  }
  __export($__require('npm:rxjs-marble-renderer@0.0.2/dist/marble'));
  __export($__require('npm:rxjs-marble-renderer@0.0.2/dist/marble-renderer'));
  __export($__require('npm:rxjs-marble-renderer@0.0.2/dist/marble-component'));
  global.define = __define;
  return module.exports;
});

System.registerDynamic("npm:rxjs-marble-renderer@0.0.2", ["npm:rxjs-marble-renderer@0.0.2/dist/index"], true, function($__require, exports, module) {
  ;
  var global = this,
      __define = global.define;
  global.define = undefined;
  module.exports = $__require('npm:rxjs-marble-renderer@0.0.2/dist/index');
  global.define = __define;
  return module.exports;
});

System.register("npm:rxjs-marble-renderer@0.0.2/dist/marble-component.css!github:systemjs/plugin-css@0.1.20", [], function() { return { setters: [], execute: function() {} } });

System.register("app/index/index.ts", ["npm:angular2@2.0.0-beta.0/core", "npm:angular2@2.0.0-beta.0/common", "npm:rxjs@5.0.0-beta.0/Rx", "npm:rxjs-marble-renderer@0.0.2", "npm:rxjs-marble-renderer@0.0.2/dist/marble-component.css!github:systemjs/plugin-css@0.1.20"], function(exports_1) {
    'use strict';
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1, Rx, rxjs_marble_renderer_1;
    var Index;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (Rx_1) {
                Rx = Rx_1;
            },
            function (rxjs_marble_renderer_1_1) {
                rxjs_marble_renderer_1 = rxjs_marble_renderer_1_1;
            },
            function (_1) {}],
        execute: function() {
            console.log('index.ts..()', rxjs_marble_renderer_1.MarbleComponent);
            Index = (function () {
                function Index() {
                    this._combine = 'combineAll';
                }
                Object.defineProperty(Index.prototype, "combine", {
                    get: function () {
                        return this._combine;
                    },
                    set: function (value) {
                        if (this._combine == value)
                            return;
                        this._combine = value;
                        this.refreshData();
                    },
                    enumerable: true,
                    configurable: true
                });
                Index.prototype.ngOnInit = function () {
                    this.refreshData();
                };
                Index.prototype.refreshData = function () {
                    var _this = this;
                    console.log(this.combine, rxjs_marble_renderer_1.Marble);
                    var order = 0;
                    var marble = new rxjs_marble_renderer_1.Marble;
                    var duration = 1000 * 0.1;
                    marble.newStream('combined', { description: 'Combined', parents: ['1', 'a', 'A'] });
                    var observable = Rx.Observable.of('1', 'a', 'A')
                        .do(function (x) { return marble.newStream(x, { description: "" + x }); })
                        .map(function (x) { return x.charCodeAt(0); })
                        .map(function (x) {
                        return Rx.Observable.concat(Rx.Observable.of(String.fromCharCode(x)).delay(Math.random() * duration), Rx.Observable.of(String.fromCharCode(x + 1)).delay(Math.random() * duration), Rx.Observable.of(String.fromCharCode(x + 2)).delay(Math.random() * duration))
                            .do(function (x) { return marble.getStream(x).add(x, order++); }); // collect marble
                    });
                    observable[this.combine]()
                        .do(function (x) { return marble.getStream('combined').add(x, order++); }) // collect marble
                        .subscribe(null, function (e) { return console.log("error: " + e); }, function () { return _this.marble = marble; });
                };
                Index = __decorate([
                    core_1.Component({
                        selector: 'rxjs-marbles-sample'
                    }),
                    core_1.View({
                        template: "\n\t<marble-component width=\"800\" height=\"450\" [marble]=\"marble\"></marble-component>\n\t<div>\n\t\t<select [(ngModel)]=\"combine\">\n\t\t\t<option value=\"zipAll\">Zip</option>\n\t\t\t<option value=\"combineAll\">Combine</option>\n\t\t\t<option value=\"mergeAll\">Merge</option>\n\t\t\t<option value=\"concatAll\">Concat</option>\n\t\t</select>\n\t\t<button (click)=\"refreshData()\">Refresh Marble Data</button>\n\t</div>\n\t",
                        directives: [[rxjs_marble_renderer_1.MarbleComponent], common_1.FORM_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [])
                ], Index);
                return Index;
            })();
            exports_1("Index", Index);
        }
    }
});

System.register("app/sample/sample.ts", ["npm:angular2@2.0.0-beta.0/core"], function(exports_1) {
    'use strict';
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var Sample;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            Sample = (function () {
                function Sample() {
                }
                Sample = __decorate([
                    core_1.Component({
                        selector: 'content-sample'
                    }),
                    core_1.View({
                        template: "<h1>sample page</h1>"
                    }), 
                    __metadata('design:paramtypes', [])
                ], Sample);
                return Sample;
            })();
            exports_1("Sample", Sample);
        }
    }
});

System.register("app/main/main.ts", ["npm:angular2@2.0.0-beta.0/core", "npm:angular2@2.0.0-beta.0/router", "app/main/main.models.ts", "app/index/index.ts", "app/sample/sample.ts"], function(exports_1) {
    'use strict';
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, router_1, main_models_1, index_1, sample_1;
    var Main;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (main_models_1_1) {
                main_models_1 = main_models_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (sample_1_1) {
                sample_1 = sample_1_1;
            }],
        execute: function() {
            Main = (function () {
                function Main(model) {
                    this.model = model;
                    model.appName = '--rxjs-marble-renderer';
                }
                Main = __decorate([
                    core_1.Component({
                        selector: 'app-main',
                        providers: [
                            router_1.ROUTER_PROVIDERS,
                            core_1.provide(main_models_1.SampleModel, { useClass: main_models_1.SampleModel }),
                            core_1.provide(router_1.LocationStrategy, { useClass: router_1.HashLocationStrategy })
                        ]
                    }),
                    core_1.View({
                        templateUrl: 'app/main/main.html',
                        directives: [router_1.ROUTER_DIRECTIVES]
                    }),
                    router_1.RouteConfig([
                        { path: '/', name: 'Index', component: index_1.Index },
                        { path: '/sample', name: 'Sample', component: sample_1.Sample }
                    ]), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof main_models_1.SampleModel !== 'undefined' && main_models_1.SampleModel) === 'function' && _a) || Object])
                ], Main);
                return Main;
                var _a;
            })();
            exports_1("Main", Main);
        }
    }
});

System.register("app/boot.ts", ["npm:angular2@2.0.0-beta.0/platform/browser", "app/main/main.ts"], function(exports_1) {
    'use strict';
    var browser_1, main_1;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (main_1_1) {
                main_1 = main_1_1;
            }],
        execute: function() {
            //enableProdMode();
            browser_1.bootstrap(main_1.Main);
        }
    }
});

System.register('npm:rxjs-marble-renderer@0.0.2/dist/marble-component.css!github:systemjs/plugin-css@0.1.20', [], false, function() {});
//# sourceMappingURL=app.js.map