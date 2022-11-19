import {Component, OnInit} from '@angular/core';
import {ReceiptItem} from "../scanner/scanner.page";
import {Preferences} from "@capacitor/preferences";
import {Router} from "@angular/router";

@Component({
	selector: 'app-receipt-items',
	templateUrl: './receipt-items.page.html',
	styleUrls: ['./receipt-items.page.scss'],
})
export class ReceiptItemsPage implements OnInit {

	receiptItems: ReceiptItem[] = [];

	private readonly RECEIPT_ITEMS_KEY: string = "receiptItems";

	constructor(private router: Router) {
	}

	async ngOnInit() {
		await Preferences
			.get({
				key: this.RECEIPT_ITEMS_KEY,
			})
			.then((v) => this.receiptItems = JSON.parse(v.value || '[]') || []);
	}

	delete(index: number) {
		this.receiptItems.splice(index, 1);

		Preferences.set({
			key: this.RECEIPT_ITEMS_KEY,
			value: JSON.stringify(this.receiptItems),
		})
	}

	back() {
		Preferences
			.remove({
				key: this.RECEIPT_ITEMS_KEY,
			})
			.then(() => this.router.navigate(['/scanner']));
	}
}
