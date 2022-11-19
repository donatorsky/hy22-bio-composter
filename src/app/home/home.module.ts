import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {HomePage} from './home.page';

import {HomePageRoutingModule} from './home-routing.module';
import {HeaderComponent} from '../header/header.component';
import {ProgressbarComponent} from '../progressbar/progressbar.component';
import {NavbarComponent} from '../navbar/navbar.component';


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		HomePageRoutingModule
	],
	exports: [
		HeaderComponent
	],
	declarations: [HomePage, HeaderComponent, ProgressbarComponent, NavbarComponent]
})
export class HomePageModule {
}
