// angular
import { NgModule } from '@angular/core';

// app
import { SharedModule } from '../../../shared/shared.module';
import { LoadingAnimationComponent } from './components/loading-animation.component';

@NgModule({
	imports: [
		SharedModule
	],
	declarations: [
		LoadingAnimationComponent
	],
	exports: [
		LoadingAnimationComponent
	]
})

export class LoadingAnimationModule {
}
