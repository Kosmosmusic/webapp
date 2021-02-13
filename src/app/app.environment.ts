import {
  IEnvironmentInterface,
  IFirebaseEnvInterface,
  IGoogleApiEnvInterface,
  ISoundcloudEnvInterface,
} from './interfaces/app-environment/app-environment.interface';

/**
 * Application environment as a constant.
 */
export const ENV: IEnvironmentInterface = {
  soundcloud: {
    clientId: 'SOUNDCLOUD_CLIENT_ID',
  },
  firebase: {
    apiKey: 'FIREBASE_API_KEY',
    authDomain: 'FIREBASE_AUTH_DOMAIN',
    databaseURL: 'FIREBASE_DATABASE_URL',
    projectId: 'FIREBASE_PROJECT_ID',
    storageBucket: 'FIREBASE_STORAGE_BUCKET',
    messagingSenderId: 'FIREBASE_MESSAGING_SENDER_ID',
    appId: 'FIREBASE_APP_ID',
  },
  gapi: {
    browserKey: 'GOOGLE_APIS_BROWSER_KEY',
    channelId: 'UC2HOUBVyZw9mPM3joMShYKQ',
    part:
      'snippet,contentDetails,statistics,topicDetails,status,brandingSettings,invideoPromotion,contentOwnerDetails',
    order: 'date',
    maxResults: '50',
  },
};

/**
 * Application environment.
 */
export class AppEnvironmentConfig {
  public soundcloud: ISoundcloudEnvInterface = {
    clientId: 'SOUNDCLOUD_CLIENT_ID',
  };

  public firebase: IFirebaseEnvInterface = {
    apiKey: 'FIREBASE_API_KEY',
    authDomain: 'FIREBASE_AUTH_DOMAIN',
    databaseURL: 'FIREBASE_DATABASE_URL',
    projectId: 'FIREBASE_PROJECT_ID',
    storageBucket: 'FIREBASE_STORAGE_BUCKET',
    messagingSenderId: 'FIREBASE_MESSAGING_SENDER_ID',
    appId: 'FIREBASE_APP_ID',
  };

  public gapi: IGoogleApiEnvInterface = {
    browserKey: 'GOOGLE_APIS_BROWSER_KEY',
    channelId: 'UC2HOUBVyZw9mPM3joMShYKQ',
    part:
      'snippet,contentDetails,statistics,topicDetails,status,brandingSettings,invideoPromotion,contentOwnerDetails',
    order: 'date',
    maxResults: '50',
  };
}
