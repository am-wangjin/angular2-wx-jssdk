import { Injectable } from '@angular/core';

declare var wx;

export interface JsapiSignature {
  appId: string;
  timestamp: string;
  nonceStr: string;
  signature: string;
}

export interface Config {
  debug: boolean;
  jsApiList: Array<string>;
}

export abstract class RequestJsapiSignature {

  abstract request(): Promise<JsapiSignature>;
  abstract getConfig(): Config;
}

@Injectable()
export class WeixinJssdkProvider {

  private inited: boolean = false;

  constructor(
    private requestJsapiSignature: RequestJsapiSignature) {
  }

  private initConfig(): Promise<any> {
    let me = this;
    return new Promise((resolve, reject) => {
      this.requestJsapiSignature.request()
        .then(v => {
          wx.config({
            debug: me.requestJsapiSignature.getConfig().debug,
            appId: v.appId,
            timestamp: v.timestamp,
            nonceStr: v.nonceStr,
            signature: v.signature,
            jsApiList: me.requestJsapiSignature.getConfig().jsApiList
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
    if (!this.isWeixinBrowser()) {
      return Promise.reject('请在微信浏览器下使用微信jsapi');
    }
    if (!this.inited) {
      return this.initConfig().then(() => {
        return this._invoke(name, req);
      });
    }
    return this._invoke(name, req);
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

  isWeixinBrowser(): boolean {
    return (navigator.userAgent.indexOf('MicroMessenger') !== -1);
  }
}