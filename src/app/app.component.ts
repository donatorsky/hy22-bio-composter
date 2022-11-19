import {Component} from '@angular/core';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import {StorageService} from "./services/storage.service";


@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
})
export class AppComponent {
	constructor(
		private sqlite: SQLite,
		private storageService: StorageService
	) {
	}

	async ngOnInit() {
		if (!this.storageService.getDatabaseExists()) {
			this.createDatabase().then(
				() => this.storageService.setDatabaseExists(true)
			)
		}
	}

	public createDatabase() {
		return this.sqlite.create({
			name: 'data.db',
			location: 'default'
		})
			.then((db: SQLiteObject) => {

				db.executeSql(`create table wastes(
    															name VARCHAR(64),
    															weight REAL,
                   								date VARCHAR(12)
                   )`, [])
					.then(() => console.log('Executed SQL'))
					.catch(e => console.log(e));

			})
			.catch(e => console.log(e));
	}
}
