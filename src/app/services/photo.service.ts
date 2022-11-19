import {Injectable} from '@angular/core';
import {Camera, CameraResultType, CameraSource} from '@capacitor/camera';

@Injectable({
	providedIn: 'root'
})
export class PhotoService {

	constructor() {
	}

	public async capturedPhoto() {
		return await Camera.getPhoto({
			resultType: CameraResultType.Uri,
			source: CameraSource.Camera,
			correctOrientation: true,
			quality: 100,
		});
	}
}
