/**
 * 当期项目公共组件使用的接口
 */
import { service } from "win-trade-base";
const dfasUserRole = "/dfas-auth-center";
export default class PublicServese {
    // 角色用户树结构
    getRoleUserTree(authFlag) {
        return service.httpService({
            baseURL: dfasUserRole,
            url: `/userRole/getRoleUserTree/${authFlag}`,
            method: "get",
        });
    }
    // 机构用户树
    getOrgUserTree(authFlag) {
        return service.httpService({
            baseURL: dfasUserRole,
            url: `/userOrg/getOrgUserTree/${authFlag}`,
            method: "get"
        });
    }
}
