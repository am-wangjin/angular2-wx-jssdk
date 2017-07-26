import { Inject, Injectable } from '@angular/core';
import { ConfigProvider } from '../config/config';

declare var wx;

export interface JsapiSignature {
  appId: string;
  timestamp: string;
  nonceStr: string;
  signature: string;
}

export interface RequestJsapiSignature {
  request(): Promise<JsapiSignature>;
}

@Injectable()
export class WeixinJssdkProvider {

  private inited: boolean = false;

  constructor(
    @Inject('RequestJsapiSignature') private requestJsapiSignature: RequestJsapiSignature,
    private config: ConfigProvider) {
  }

  private initConfig(): Promise<any> {
    let me = this;
    return new Promise((resolve, reject) => {
      this.requestJsapiSignature.request()
        .then(v => {
          wx.config({
            debug: me.config.get().debug,
            appId: v.appId,
            timestamp: v.timestamp,
            nonceStr: v.nonceStr,
            signature: v.signature,
            jsApiList: me.config.get().jsApiList
          });
        });
      wx.ready(() => {
        me.inited = true;
        resolve();
      });
      wx.error(e => {
        me.inited = false;
        reject(e);
      });
    });
  }

  invoke(name: string, req?: any): Promise<any> {
    if (!this.inited) {
      return this.initConfig().then(() => {
        return this._invoke(name, req);
      });
    }
  }

  private _invoke(name: string, req?: any): Promise<any> {
    const fn = wx[name] as Function;
    return new Promise<any>((resolveFn, rejectFn) => {
      fn(Object.assign({}, req, {
        success: (r) => { resolveFn(r); },
        cancel: () => { resolveFn(null); },
        fail: (r) => { rejectFn(r); },
      }));
    });
  }
}