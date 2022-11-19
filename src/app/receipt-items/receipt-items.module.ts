import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ReceiptItemsPageRoutingModule} from './receipt-items-routing.module';

import {ReceiptItemsPage} from './receipt-items.page';
import {HomePageModule} from "../home/home.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReceiptItemsPageRoutingModule,
        HomePageModule
    ],
	declarations: [ReceiptItemsPage]
})
export class ReceiptItemsPageModule {
}
