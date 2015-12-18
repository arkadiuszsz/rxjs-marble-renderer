'use strict';
import {Component, View, provide} from 'angular2/core';
import {ROUTER_PROVIDERS, ROUTER_DIRECTIVES, RouteConfig, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {SampleModel} from "./main.models";
import {Index} from "../index/index";
import {Sample} from "../sample/sample";

@Component({
	selector: 'app-main',
	providers: [
		ROUTER_PROVIDERS,
		provide(SampleModel, {useClass: SampleModel}),
		provide(LocationStrategy, {useClass: HashLocationStrategy})
	]
})
@View({
	templateUrl: 'app/main/main.html',
	directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
	{path: '/', name: 'Index', component: Index},
	{path: '/sample', name: 'Sample', component: Sample}
])
export class Main {
	constructor(private model:SampleModel) {
		model.appName = '--rxjs-marble-renderer';
	}
}