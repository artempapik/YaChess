import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import { ServerModule } from '@angular/platform-server';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { AppModule } from './app.module';

@NgModule({
    imports: [AppModule, ServerModule, ModuleMapLoaderModule],
    bootstrap: [AppComponent]
})

export class AppServerModule { }
