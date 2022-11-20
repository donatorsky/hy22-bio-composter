import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ReceiptItem, StorageService} from '../services/storage.service';
import {SQLite} from "@ionic-native/sqlite/ngx";

@Component({
	selector: 'app-receipt-items',
	templateUrl: './receipt-items.page.html',
	styleUrls: ['./receipt-items.page.scss'],
})
export class ReceiptItemsPage implements OnInit {

	receiptItems: ReceiptItem[] = [];

	constructor(
		private sqlite: SQLite,
		private router: Router,
		private storageService: StorageService,
	) {
	}

	ngOnInit() {
	}

	ionViewWillEnter() {
		this.receiptItems = this.storageService.getReceiptItems();
	}

	delete(index: number) {
		return this.storageService.removeReceiptItemByIndex(index);
	}

	back() {
		return this.storageService
			.clearReceiptItems()
			.then(() => this.router.navigate(['/home']));
	}

	save() {
		this.storageService
			.storeReceiptItems()
			.then(() => this.router.navigate(['/home', {refresh: true}]));
	}
}
