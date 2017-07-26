import { Injectable } from '@angular/core';
import * as _ from 'lodash';
export interface Config {
  debug?: boolean;
  jsApiList: Array<string>;
}

const defaultConfig: Config = { debug: true, jsApiList: [] };

@Injectable()
export class ConfigProvider {
  private _config: Config;

  get(): Config {
    return this._config;
  }

  init(config: Config) {
    this._config = _.isUndefined(config) ? defaultConfig : { ...defaultConfig, ...config };
  }
}

export function setupConfig(userConfig: Config): ConfigProvider {
  const conifg = new ConfigProvider();
  conifg.init(userConfig);
  return conifg;
}
