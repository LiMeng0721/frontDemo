//机构固定的代码
export const constantOrgCode = {
    ZyjjCode: 'ROOT01_INSIDE', //中银基金
    WbryCode: 'ROOT02_EXTERNAL', //外包人员
    WfpbmyhCode: 'ROOT03_UNALLOCATED' //未分配部门用户
}
//机构类型
export const constantOrgType = {
    BM: 'D', //部门
    BMXZ: 'DG', //部门小组
    BMGW: 'DP' //部门岗位
}
//树的节点类型
export const TREETYPE = {
    ...constantOrgType,
    USER:'USER',// 用户
    ROLE: 'ROLE'// 角色
}
//树的节点图标
export const TREEICON = {
    [TREETYPE.BM]: 'apartment',
    [TREETYPE.BMGW]: 'flag',
    [TREETYPE.BMXZ]:'team',
    [TREETYPE.USER]:'user',
    [TREETYPE.ROLE]: 'idcard'
}
//代理类型
export const PROXYTYPE = {
    JG: 'G', //部门
    USER: 'U', //部门小组
    ROLE: 'R' //部门岗位
}
//权限拷贝数据枚举
export const AUTHCOPYTYPE = {
    MENU: 'menu', //菜单权限
    FUNC: 'func', //功能权限
    COLUMN: 'column', //菜单列头访问权限
    DATA: 'data' //数据访问权限
}
//菜单url
export const MENUURL = {
    AUTHSETTING: '/dfas-auth-center/dfas/dfas-auth-center/index.html#/auth-setting' //权限设置的菜单路径
}