import {Injectable} from '@angular/core';
import {Preferences} from '@capacitor/preferences';

@Injectable({
	providedIn: 'root'
})
export class StorageService {

	private readonly RECEIPT_ITEMS_KEY: string = 'receiptItems';

	private receiptItems: ReceiptItem[] = [];

	constructor() {
		Preferences
			.get({key: this.RECEIPT_ITEMS_KEY})
			.then((v) => this.receiptItems = JSON.parse(v.value || '[]') || []);
	}

	public getReceiptItems() {
		return this.receiptItems;
	}

	public setReceiptItems(items: ReceiptItem[]) {
		this.receiptItems = items;

		return Preferences.set({
			key: this.RECEIPT_ITEMS_KEY,
			value: JSON.stringify(items),
		});
	}

	public removeReceiptItemByIndex(index: number) {
		this.receiptItems.splice(index, 1);

		return Preferences.set({
			key: this.RECEIPT_ITEMS_KEY,
			value: JSON.stringify(this.receiptItems),
		});
	}

	public clearReceiptItems() {
		return Preferences.remove({key: this.RECEIPT_ITEMS_KEY});
	}
}

export interface ReceiptItem {
	name: string;
	weight: number;
}
