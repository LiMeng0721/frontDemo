/**
 * @file 路由配置入口文件
 * @author lzx
 */
import React from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Dynamic } from 'yss-biz';
import routes from './routes';
import project from '../project.config';

const supportsHistory = 'pushState' in window.history;
const TITLE = document.title;
const packageUrl = (url, match) => {
	return match ? match.path.replace(/^\/$/, '') + url : url;
};

const mapRoutes = (routes, prevProps = {}, switchProps = {}) => {
	return (
		<Switch {...switchProps}>
			{(routes || []).map((route, index) => {
				let { children, exact, redirect, key, path, ...rest } = route;
				let { match } = prevProps;
				path = packageUrl(path, match);
				switch (!!redirect) {
					case true:
						redirect = packageUrl(redirect, match);
						return <Redirect key={key || index} exact={exact === false ? false : true} from={path} to={redirect} {...rest}></Redirect>;
					default:
						let { component, title, ...nextRest } = rest;
						return (
							<Route
								{...nextRest}
								path={path}
								key={key || index}
								exact={exact === false ? false : true}
								render={(props) => {
									let childRoutes;
									if (children && children.length > 0) {
										childRoutes = mapRoutes(children, props, {
											location: props.location,
										});
									} else {
										document.title = title || TITLE;
										childRoutes = null;
									}
									if (component) {
										let Component = Dynamic({
											loader: component,
										});
										return (
											<Component {...props} route={route} {...project}>
												{childRoutes}
											</Component>
										);
									} else {
										return childRoutes;
									}
								}}
							/>
						);
				}
			})}
		</Switch>
	);
};

const App = () => <Router forceRefresh={!supportsHistory}>{mapRoutes(routes)}</Router>;
export default App;
