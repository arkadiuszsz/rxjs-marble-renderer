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
var core_1 = require('angular2/core');
var marble_1 = require('./marble');
var marble_renderer_1 = require('./marble-renderer');
var MarbleComponent = (function () {
    function MarbleComponent(elementRef) {
        this.elementRef = elementRef;
        this.width = 600;
        this.height = 450;
    }
    MarbleComponent.prototype.ngOnInit = function () {
    };
    MarbleComponent.prototype.ngOnChanges = function (changes) {
        if (changes.hasOwnProperty('marble') && changes['marble'].currentValue) {
            marble_renderer_1.render(this.elementRef.nativeElement.firstChild, changes['marble'].currentValue.getData());
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MarbleComponent.prototype, "width", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MarbleComponent.prototype, "height", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', marble_1.Marble)
    ], MarbleComponent.prototype, "marble", void 0);
    MarbleComponent = __decorate([
        core_1.Component({
            selector: 'marble-component'
        }),
        core_1.View({
            template: "<svg [attr.width]=\"width\" [attr.height]=\"height\"></svg>"
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], MarbleComponent);
    return MarbleComponent;
})();
exports.MarbleComponent = MarbleComponent;
//# sourceMappingURL=marble-component.js.map