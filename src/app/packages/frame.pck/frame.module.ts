// angular
import { NgModule } from '@angular/core';

// app
import { SharedModule } from '../../shared.module';
import { ScrollTopComponent } from './components/scroll-top/scroll-top.component';

@NgModule({
	imports: [SharedModule],
	declarations: [ScrollTopComponent],
	exports: [ScrollTopComponent]
})

export class FrameModule {
}
