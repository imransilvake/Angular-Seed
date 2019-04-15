// angular
import { NgModule } from '@angular/core';

// app
import { ScrollTopService } from './services/scroll-top.service';
import { FirstKeyPipe } from './pipes/first-key.pipe';

@NgModule({
	declarations: [
		FirstKeyPipe
	],
	exports: [
		FirstKeyPipe
	],
	providers: [ScrollTopService]
})

export class AccessoriesModule {
}
