import {Component} from '@angular/core';
import {ReceiptVerboseEncodedResponse, TaggunService} from '../services/taggun.service';
import {ReceiptItem, StorageService} from '../services/storage.service';
import {Router} from '@angular/router';
import {PhotoService} from '../services/photo.service';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage {

	private readonly RECEIPT_START_REGEX = /PARAGON\s+FISKALNY\s*(.+)\s*SPRZEDAŻ\s*OPODATKOWANA/mius;
	private readonly RECEIPT_ITEMS_REGEX = /^(?<name>.+?)\s+(?<weight>[\d,.]+)kg.?\s+\D?[\d,.]+\s+[\d,.]+\w?/gmi;

	public sumPositiveWaste: number = 0
	public sumNegativeWaste: number = 0

	isScanning: boolean = false;
	items: ReceiptItem[] = [];

	constructor(
		private router: Router,
		private storageService: StorageService,
		private photoService: PhotoService,
		private taggun: TaggunService,
	) {
	}

	ngOnInit(){
	}

	ionViewWillEnter() {
		this.storageService.fetchReceiptItems()
			.then(v => this.items = v as ReceiptItem[])

		this.storageService.sumPositiveWastes()
			.then(v => this.sumPositiveWaste = v)

		this.storageService.sumNegativeWastes()
			.then(v => this.sumNegativeWaste = v)
	}

	startScanning() {
		this.photoService
			.capturedPhoto()
			.then((photo) => {
				this.isScanning = true;

				return photo;
			})
			.then((photo) => this.storageService.clearReceiptItems().then(() => photo))
			.then((photo) =>
				fetch(photo.webPath!)
					.then(response => response.blob())
					.then(this.convertBlobToBase64)
					.then((photoBase64) => {
						console.log(photo, photoBase64);

						this.taggun.doReceiptVerboseEncoded(photoBase64, photo.format)
							.subscribe((response) => {
								this.isScanning = false;

								let receiptItems = this.parseReceiptItems(response);

								console.log(response, receiptItems);

								return this.storageService
									.setReceiptItems(receiptItems)
									.then(() => this.router.navigate(['/receipt-items']));
							})
					}))
			.catch(() => this.isScanning = false);
	}

	public setStatus(id: number, status: number) {
		this.storageService.setStatus(id, status).
			then(() => this.storageService.sumPositiveWastes().then(v => this.sumPositiveWaste = v)).
			then(() => this.storageService.sumNegativeWastes().then(v => this.sumNegativeWaste = v)).
			then(()=>this.items.pop())
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
		let regExpExecArray = this.RECEIPT_START_REGEX.exec(response.text.text);

		if (regExpExecArray === null) {
			return [];
		}

		console.log(regExpExecArray[1]);

		let items: ReceiptItem[] = [], m;

		while ((m = this.RECEIPT_ITEMS_REGEX.exec(regExpExecArray[1])) !== null) {
			if (m.index === this.RECEIPT_ITEMS_REGEX.lastIndex) {
				this.RECEIPT_ITEMS_REGEX.lastIndex++;
			}

			items.push(<ReceiptItem>{
				name: m[1],
				weight: parseFloat(m[2].replace(',', '.')),
				waste: parseFloat(m[2].replace(',', '.'))*0.1,
			})
		}

		return items;
	}
}
