// angular
import { NgModule } from '@angular/core';

// app
import { SharedModule } from '../../../shared/shared.module';
import { LoadingAnimationComponent } from './components/loading-animation.component';
import { LoadingAnimationService } from './services/loading-animation.service';

@NgModule({
	imports: [
		SharedModule
	],
	declarations: [
		LoadingAnimationComponent
	],
	exports: [
		LoadingAnimationComponent
	],
	providers: [
		LoadingAnimationService
	]
})

export class LoadingAnimationModule {
}
