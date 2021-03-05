/**
 * 获取树节点的一个层级关系的路径数组
 * @param {*} rows  整个树对象
 * @param {*} keyType 需要对比的key值
 * @param {*} checkedKey 选中的value值
 */
export const getTreeNodePath = (rows, keyType, checkedKey) => {
	const curNodes = [];
	const findNode = (rows, checkedKey) => {
		for (let i = 0; i < rows.length; i++) {
			if (rows[i][keyType] === checkedKey) {
				curNodes.push(rows[i]);
				return true;
			}
			if (rows[i].children && rows[i].children.length) {
				if (findNode(rows[i].children, checkedKey)) {
					curNodes.push(rows[i]);
					return true;
				}
			}
		}
	};
	findNode(rows, checkedKey);
	return curNodes.reverse();
};
/**
 * 获取已经授权的某一个菜单的menuCode
 * @param {*} url  该菜单的路径
 */
export const getMenuCode = (url) => {
	//获取该用户拥有的所有的菜单权限
	const allMenuInfo = JSON.parse(localStorage.getItem('uma')) || [];
	if (!allMenuInfo) {
		return;
	}
	const menu = allMenuInfo.filter((item) => item.menuAddress === url);
	return menu[0];
};

