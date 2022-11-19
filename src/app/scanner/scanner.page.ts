import {Component, OnInit} from '@angular/core';
import {PhotoService} from '../services/photo.service';

@Component({
	selector: 'app-scanner',
	templateUrl: './scanner.page.html',
	styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit {

	constructor(public photoService: PhotoService) {
	}

	ngOnInit() {
	}

	addPhotoToGallery() {
		this.photoService.addNewToGallery();
	}

}
