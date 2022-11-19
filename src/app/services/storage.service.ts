import {Injectable} from '@angular/core';
import {Preferences} from '@capacitor/preferences';

@Injectable({
	providedIn: 'root'
})
export class StorageService {

	private readonly RECEIPT_ITEMS_KEY: string = 'receiptItems';
	private readonly DATABASE_EXISTS: string = 'databaseExists';

	private receiptItems: ReceiptItem[] = [];
	private databaseExists: boolean = false;

	constructor() {
		Preferences
			.get({key: this.RECEIPT_ITEMS_KEY})
			.then((v) => this.receiptItems = JSON.parse(v.value || '[]') || []);

		Preferences
			.get({key: this.DATABASE_EXISTS})
			.then((v) => this.databaseExists = JSON.parse(v.value || 'false') || false);
	}

	public getReceiptItems() {
		return this.receiptItems;
	}

	public getDatabaseExists() {
		return this.databaseExists;
	}

	public setReceiptItems(items: ReceiptItem[]) {
		this.receiptItems = items;

		return Preferences.set({
			key: this.RECEIPT_ITEMS_KEY,
			value: JSON.stringify(items),
		});
	}

	public setDatabaseExists(value: boolean) {
		this.databaseExists = value;

		return Preferences.set({
			key: this.DATABASE_EXISTS,
			value: JSON.stringify(value),
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
