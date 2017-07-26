import { NgModule } from '@angular/core';

const PROVIDERS: Array<any> = [
];

@NgModule({
  imports: [
    AlphaScrollModule.forRoot(),
    BaiduMapModule.forRoot(),
    ImageLoaderModule.forRoot(),
    DownloadManagerModule.forRoot(),
    OpenUrlModalModule.forRoot(),
    RibbonModule.forRoot(),
    SuperTabsModule.forRoot(),
    StarRatingModule.forRoot(),
    PipesModule.forRoot(),
    NavButtonBarModule.forRoot(),
    GalleryModule.forRoot(),
    LazySelectModule.forRoot(),
    AutoCompleteModule.forRoot(),
    ImgFallbackModule.forRoot()
  ],
  exports: [
    AlphaScrollModule,
    BaiduMapModule,
    ImageLoaderModule,
    DownloadManagerModule,
    OpenUrlModalModule,
    RibbonModule,
    SuperTabsModule,
    StarRatingModule,
    PipesModule,
    NavButtonBarModule,
    GalleryModule,
    LazySelectModule,
    AutoCompleteModule,
    ImgFallbackModule
  ]
})
export class ExtIonicModule {
  static forRoot(config?: Config): ModuleWithProviders {
    return {
      ngModule: ExtIonicModule,
      providers: [
        { provide: EXT_IONIC_CONFIG, useValue: config },
        { provide: ConfigProvider, useFactory: setupConfig, deps: [EXT_IONIC_CONFIG] },
        PROVIDERS
      ]
    };
  }
}
