import {Component, Input, OnInit} from '@angular/core';
import {ReceiptItem, StorageService} from "../services/storage.service";

@Component({
	selector: 'app-progressbar',
	templateUrl: './progressbar.component.html',
	styleUrls: ['./progressbar.component.scss'],
})
export class ProgressbarComponent implements OnInit {
	public _sumPositiveWaste: number = 0;
	@Input()
	set sumPositiveWaste(v: number) {
		this._sumPositiveWaste = v
		this.sum = v + this._sumNegativeWaste
	}

	public _sumNegativeWaste: number = 0;
	@Input()
	set sumNegativeWaste(v: number) {
		this._sumNegativeWaste = v
		this.sum = v + this._sumPositiveWaste
	}

	public sum: number = 0
	constructor() {
	}

	ngOnInit() {
	}

}
