import {Component, Input, OnInit} from '@angular/core';

@Component({
	selector: 'app-progressbar',
	templateUrl: './progressbar.component.html',
	styleUrls: ['./progressbar.component.scss'],
})
export class ProgressbarComponent implements OnInit {
	public _wastedValue: number = 30;
	@Input()
	set wastedValue(v: number) {
		this._wastedValue = v
	}


	constructor() {
	}

	ngOnInit() {
	}

}
