import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ReceiptItem, StorageService} from '../services/storage.service';

@Component({
	selector: 'app-receipt-items',
	templateUrl: './receipt-items.page.html',
	styleUrls: ['./receipt-items.page.scss'],
})
export class ReceiptItemsPage implements OnInit {

	receiptItems: ReceiptItem[] = [];

	constructor(
		private router: Router,
		private storageService: StorageService,
	) {
	}

	async ngOnInit() {
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
}
