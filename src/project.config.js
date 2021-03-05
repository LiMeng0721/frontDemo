/*
 * @Author: zhz
 * @Date: 2020-08-18 15:17:22
 * @LastEditors: zhz
 * @LastEditTime: 2020-08-18 15:21:49
 * @Description:
 */


export default {
  "productName": "赢.投资",//头部产品名称
  "platformName": "中银基金一体化平台",//平台名称
  "platformNameEn": "Asset Management System",//平台英文名称
  // "productLogin": "zy",//登陆模板
  "productMenu": "sideMenu",//产品菜单模式sideMenu
  "isIframe": false,//是否开启iframe 模式
  "tool": {
   // "isNew": true,//是否显示提示消息
    "theme": {//显示主题
      isShow: true,
      themeList: [{ "name": "星空蓝", "className": "darkBlue" },{ "name": "科技黑红", "className": "darkRed" }, { "name": "亮红", "className": "lightRed" }, { "name": "亮蓝", "className": "lightBlue" }]
    },
    "isLockScreen": true//是否显示上锁
  }
}