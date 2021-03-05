/**
 * 参数表 Service
 */
import { service } from "win-trade-base";
class DataMapService {
    /**
     * 分页查询
     * @param {*} params 
     */
    getDataMapPageList(params) {
        return service.httpService({
            baseURL: service.dfasBaseBiz,
            url: "/data/map/pageList",
            method: "post",
            data: params
        });
    }
    /**
     * 获取数据映射类型
     * @param {*} params 
     */
    getDataTypeList(params) {
        return service.httpService({
            baseURL: service.dfasBaseBiz,
            url: "/data/map/type/list",
            method: "post",
            data: params
        });
    }
    /**
     * 新增
     * @param {*} params 
     */
    addDataMap(params) {
        return service.httpService({
            baseURL: service.dfasBaseBiz,
            url: "/data/map/save",
            method: "post",
            data: params
        });
    }
    /**
     * 获取数据类型
     * @param {*} params 
     */
    getDataMap(params) {
        return service.httpService({
            baseURL: service.dfasBaseBiz,
            url: `/data/map/${params.mapType}/${params.dataCode}`,
            method: "get",
        });
    }
    /**
     * 修改
     * @param {*} params 
     */
    updateDataMap(params) {
        return service.httpService({
            baseURL: service.dfasBaseBiz,
            url: "/data/map/update",
            method: "put",
            data: params
        });
    }
    /**
     * 删除
     * @param {*} id 
     */
    deleteDataMap(id) {
        return service.httpService({
            baseURL: service.dfasBaseBiz,
            url: `/data/map/${id}`,
            method: "delete",
        });
    }
     /**
      * 分页查询映射类型
      * @param {*} params 
      */
     getDataMapTypeList(params) {
        return service.httpService({
            baseURL: service.dfasBaseBiz,
            url: "/data/map/type/pageList",
            method: "post",
            data: params
        });
    }
    /**
     * 新增映射类型
     * @param {*} params 
     */
    addDataMapType(params) {
        return service.httpService({
            baseURL: service.dfasBaseBiz,
            url: "/data/map/type/save",
            method: "post",
            data: params
        });
    }
     /**
      * 修改映射类型
      * @param {*} params 
      */
     updateDataMapType(params) {
        return service.httpService({
            baseURL: service.dfasBaseBiz,
            url: "/data/map/type/update",
            method: "put",
            data: params
        });
    }
    /**
     * 删除映射类型
     * @param {*} id 
     */
    deleteDataMapType(id) {
        return service.httpService({
            baseURL: service.dfasBaseBiz,
            url: `/data/map/type/delete/${id}`,
            method: "delete",
        });
    }
}

export default new DataMapService();