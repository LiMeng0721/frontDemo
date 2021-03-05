/**
 * 系统菜单管理 Service
 * @author daizq
 */
import { service } from "win-trade-base";

class productGroupService {
    /**
     * 下拉框URL
     * @param {*} params 
     */
    formServiceConfig(params) {
        return {
            //产品类型
            prodType: {
                url: `${service.dfbpBaseManage}/productType/getParentType`,
                method: "POST",
                option: {
                    label: "prodTypeName",
                    value: "prodType",
                },
            },
        };
    }
    /**
     * 获取产品组树
     */
    getProductGroupTree() {
        return service.httpService({
            baseURL: service.dfbpBaseManage,
            url: "/productGroup/listProductTypeTree",
            method: "get",
        });
    }
    /**
     * 根据产品组ID获取产品
     * @param {*} params 
     */
    getProductList(params) {
        return service.httpService({
            baseURL: service.dfbpBaseManage,
            url: "/productGroupRela/pageListProductGroupRela",
            method: "post",
            data: params,
            mask: false,
        });
    }
    /**
     * 获取待分配产品list
     * @param {*} params 
     */
    getWaitList(params) {
        return service.httpService({
            baseURL: service.dfbpBaseManage,
            url: "/productGroupRela/listWaitAllot",
            method: "post",
            data: params,
        });
    }
    /**
     * 获取已分配产品list
     * @param {*} params 
     */
    getAssignedList(params) {
        return service.httpService({
            baseURL: service.dfbpBaseManage,
            url: "/productGroupRela/listProductAllot",
            method: "post",
            data: params,
        });
    }
    /**
     * 保存产品组
     * @param {*} params
     */
    saveProdGroup(params) {
        return service.httpService({
            baseURL: service.dfbpBaseManage,
            url: "/productGroup/save",
            method: "post",
            data: params,
        });
    }
    /**
     *  修改产品组
     * @param {*} params 
     */
    updateProdGroup(params) {
        return service.httpService({
            baseURL: service.dfbpBaseManage,
            url: "/productGroup/update",
            method: "put",
            data: params,
        });
    }
    /**
     * 删除产品组
     * @param {*} params 
     */
    deleteProdGroup(params) {
        return service.httpService({
            baseURL: service.dfbpBaseManage,
            url: "/productGroup/delete",
            method: "delete",
            data: params,
        });
    }
    /**
     * 产品组删除产品
     * @param {*} params 
     */
    deleteProductInGroup(params) {
        return service.httpService({
            baseURL: service.dfbpBaseManage,
            url: "/productGroupRela/batchDelete",
            method: "delete",
            data: params,
        });
    }
    /**
     * 产品组新增产品
     * @param {*} params 
     */
    addProductByGroup(params) {
        return service.httpService({
            baseURL: service.dfbpBaseManage,
            url: "/productGroupRela/batchSave",
            method: "post",
            data: params,
        });
    }
    /**
     * 获取产品子类型
     * @param {*} params 
     */
    getProdSubTypeList(params) {
        return service.httpService({
            baseURL: service.dfbpBaseManage,
            url: "/productType/getSubType",
            method: "post",
            data: params,
        });
    }
}
export default new productGroupService();
