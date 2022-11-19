import {Component, OnInit} from '@angular/core';
import {PhotoService} from '../services/photo.service';
import {Photo} from "@capacitor/camera";
import {HttpClient} from '@angular/common/http';

@Component({
	selector: 'app-scanner',
	templateUrl: './scanner.page.html',
	styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit {

	photo: Photo | null = null;

	constructor(
		public photoService: PhotoService,
		private http: HttpClient,
	) {
	}

	ngOnInit() {
	}

	addPhotoToGallery() {
		this.photoService
			.capturedPhoto()
			.then((photo) => this.photo = photo)
			.then(() => {
				this.http.get('https://dummyjson.com/products/1')
					.subscribe((v) => console.log(v));
			});
	}
}
