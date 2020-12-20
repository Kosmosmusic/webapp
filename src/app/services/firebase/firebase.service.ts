import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class AppFirebaseService {
  constructor(private readonly fireDb: AngularFireDatabase) {}

  public getListItem<T = unknown>(collection: 'about' | 'mastering' | 'bandcamp') {
    return this.fireDb.object<T>('/' + collection);
  }
}
