import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from 'src/app/app.module';

enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule).catch((err) => {
  console.log('platform bootstrap error:', err);
});
