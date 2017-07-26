import { ModuleWithProviders, NgModule } from '@angular/core';
import { Config, ConfigProvider, setupConfig } from './config/config';
export * from './config/config';
export * from './providers/weixin_jssdk';

@NgModule()
export class WexinJsapiModule {
  static forRoot(config?: Config): ModuleWithProviders {
    return {
      ngModule: WexinJsapiModule,
      providers: [
        { provide: ConfigProvider, useFactory: setupConfig, deps: [config], multi: true }
      ]
    };
  }
}
