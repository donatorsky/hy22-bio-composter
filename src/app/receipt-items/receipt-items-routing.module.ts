import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ReceiptItemsPage} from './receipt-items.page';

const routes: Routes = [
	{
		path: '',
		component: ReceiptItemsPage
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ReceiptItemsPageRoutingModule {
}
