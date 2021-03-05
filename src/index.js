/**
 * 应用入口
 * @author zhz
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { service, appModel } from 'win-trade-base';
import { MainPort } from 'yss-biz';
import ChildRoutes from './router';
import project from './project.config';
import 'win-trade-base/static/css/main.css';
import 'yss-biz/index.css';
if (!window.singleSpaNavigate) {
  ReactDOM.render(<MainPort ChildRoutes={ChildRoutes} {...project} />, document.getElementById('root'));
}

// 提供基础服务
export const baseConfig = {
  service,
  appModel,
};
