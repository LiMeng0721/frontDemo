/*
 * @Author: zhangkuangwen
 * @Date: 2020-04-03 15:17:22
 * @LastEditors: zhangkuangwen
 * @LastEditTime: 2020-04-03 15:21:49
 * @Description:
 */
import loadable from '@loadable/component'

const modules = require.context('page', true, /\.\/[\w-]+\/view\/index\.js$/);
const HomeView = loadable(() =>
  import('win-trade-base').then((module) => {
    return module.HomeViewZy
  })
)
const NotFondView = loadable(() =>
  import('win-trade-base').then((module) => {
    return module.NotFondView
  })
)
let routes = [];
modules.keys().forEach((key) => {
	routes.push({
		path: key.replace(/\.(\/[\w-]+)\/view\/index\.js$/, '$1'),
		component: modules(key).default,
	});
});
routes.push({
	  path: '/home',
    component: HomeView,
},{
    path: '*',
    component: NotFondView,
    exact: false,
})
export default routes.filter((r) => r);
