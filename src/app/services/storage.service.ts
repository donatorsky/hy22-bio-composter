import {Injectable} from '@angular/core';
import {Preferences} from '@capacitor/preferences';
import {SQLite, SQLiteObject} from "@ionic-native/sqlite/ngx";
import {ReceiptItemsPage} from "../receipt-items/receipt-items.page";

@Injectable({
	providedIn: 'root'
})
export class StorageService {

	private readonly RECEIPT_ITEMS_KEY: string = 'receiptItems';
	private readonly DATABASE_EXISTS: string = 'databaseExists';

	private receiptItems: ReceiptItem[] = [];
	private databaseExists: boolean = false;
	private dbConnection: SQLiteObject | null = null;

	constructor(private sqlite: SQLite) {
		Preferences
			.get({key: this.RECEIPT_ITEMS_KEY})
			.then((v) => this.receiptItems = JSON.parse(v.value || '[]') || []);

		Preferences
			.get({key: this.DATABASE_EXISTS})
			.then((v) => this.databaseExists = JSON.parse(v.value || 'false') || false);
	}

	public initDatabase() {
		if (this.databaseExists) {
			return Promise.resolve();
		}

		return this.sqlite
			.create({
				name: 'data.db',
				location: 'default'
			})
			.then((db: SQLiteObject) => {
				db.executeSql(`create table wastes
											 (
												 name   VARCHAR(64),
												 weight REAL,
												 date   VARCHAR(12)
											 )`, [])
					.then(() => console.log('Executed SQL'))
					.catch(e => console.log(e));

				this.dbConnection = db;
			})
			.catch(console.error);
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

	public storeReceiptItems() {
		if (!this.dbConnection) {
			return Promise.reject();
		}

		if (this.receiptItems.length < 1) {
			return Promise.resolve();
		}

		const bindings: any[] = [];

		this.receiptItems.forEach((item) => bindings.push(item.name, item.weight, new Date().toString()));

		return this.dbConnection
			?.executeSql(`INSERT INTO wastes("name", "weight", "date")
										VALUES ${'(?, ?, ?),'.repeat(this.receiptItems.length-1) + '(?, ?, ?)'}`, bindings)
			.then(() => this.clearReceiptItems);
	}

	public fetchReceiptItems() {
		console.log("fetchReceiptItems 1");
		if (!this.dbConnection) {
			console.error('nie mam połączenia z bazą');
			return Promise.reject();
		}

		return this.dbConnection.executeSql(`SELECT "name", "weight" FROM "wastes" ORDER BY "date" ASC`, [])
			.then((response) => {
				const items: ReceiptItem[] = []

				console.log("fetchReceiptItems 2");

				for (let i = 0; i < response.rows.length; i++) {
					const currentItem = response.rows.item(i);

					items.push(<ReceiptItem>{
						name: currentItem.name,
						weight: currentItem.weight,
					});
				}

				return items;
			})
			.catch(console.error);
	}
}

export interface ReceiptItem {
	name: string;
	weight: number;
}
