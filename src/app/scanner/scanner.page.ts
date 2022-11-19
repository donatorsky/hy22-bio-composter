import {Component, OnInit} from '@angular/core';
import {PhotoService} from '../services/photo.service';
import {Photo} from "@capacitor/camera";
import {HttpClient} from '@angular/common/http';
import {ReceiptVerboseEncodedResponse, TaggunService} from "../services/taggun.service";
import {Preferences} from "@capacitor/preferences";

@Component({
	selector: 'app-scanner',
	templateUrl: './scanner.page.html',
	styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit {

	photo: Photo | null = null;

	isScanning: boolean = false;

	constructor(
		public photoService: PhotoService,
		private http: HttpClient,
		private taggun: TaggunService,
	) {
	}

	ngOnInit() {
	}

	private readonly RECEIPT_ITEMS_REGEX = /^(?<name>.+?)\s+(?<weight>[\d,.]+)(?:kg)?\s+x?[\d,.]+\s+[\d,.]+\w?/gm;
	private readonly RECEIPT_ITEMS_KEY: string = "receiptItems";

	startScanning() {
		this.photoService
			.capturedPhoto()
			.then((photo) => this.photo = photo)
			.then((photo) => {
				this.isScanning = true;

				Preferences.remove({key: this.RECEIPT_ITEMS_KEY});

				return fetch(photo.webPath!)
					.then(response => response.blob())
					.then(this.convertBlobToBase64)
					.then((photoBase64) => {
						console.log(photo, photoBase64);

						this.taggun.doReceiptVerboseEncoded(photoBase64, photo.format)
							.subscribe((response) => {
								this.isScanning = false

								let receiptItems = this.parseReceiptItems(response);

								console.log(response, receiptItems);

								return Preferences.set({
									key: this.RECEIPT_ITEMS_KEY,
									value: JSON.stringify(receiptItems),
								});
							})
					});
			})
			.catch(() => this.isScanning = false);
	}

	private convertBlobToBase64(blob: Blob): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onerror = reject;
			reader.onload = () => {
				if (reader.result === null) {
					return reject();
				}

				resolve(reader.result.toString().split(',').pop() as string);
			};
			reader.readAsDataURL(blob);
		});
	}

	private parseReceiptItems(response: ReceiptVerboseEncodedResponse): ReceiptItem[] {
		let items: ReceiptItem[] = [], m;

		while ((m = this.RECEIPT_ITEMS_REGEX.exec(response.text.text)) !== null) {
			if (m.index === this.RECEIPT_ITEMS_REGEX.lastIndex) {
				this.RECEIPT_ITEMS_REGEX.lastIndex++;
			}

			items.push(<ReceiptItem>{
				name: m[1],
				weight: parseFloat(m[2].replace(',', '.')),
			})
		}

		return items;
	}
}

export interface ReceiptItem {
	name: string;
	weight: number;
}
