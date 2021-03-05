
import { message } from "antd";
import productGroupService from "../services";

export default {
    /**
     * 获取产品组树
     * @param {*} state 
     * @param {*} params 
     * @param {*} param2 
     */
    async getProductGroupTree(state, params, { getState, mutations }) {
        let result = await productGroupService.getProductGroupTree();
        if (result.code !== "200") {
            message.error(result.msg);
            return getState();
        }
        return getState().set("treeList", result.data);
    },
    /**
     * 获取产品list
     * @param {*} state 
     * @param {*} params 
     * @param {*} param2 
     */
    async getProductList(state, params, { getState, mutations }) {
        let productQuery = getState().toJS()["productQuery"];
        let productPage = getState().toJS()["productPage"];

        let result = await productGroupService.getProductList({ ...productQuery, ...productPage, ...params });
        if (result.code !== "200") {
            message.error(result.msg);
            return getState();
        }

        return getState().merge({
            productList: result.data.list,
            productTotal: result.data.total,
        }).set("tableLoading",false);
    },
    /**
     * 获取待分配产品list
     * @param {*} state 
     * @param {*} params 
     * @param {*} param2 
     */
    async getWaitList(state, params, { getState, mutations }) {
        let modalProdQuery = getState().toJS()["modalProdQuery"];
        let treeCheckItem = getState().toJS()["treeCheckItem"];

        let result = await productGroupService.getWaitList({
            ...modalProdQuery,
            ...params,
            groupCode: treeCheckItem.groupCode,
        });
        if (result.code !== "200") {
            message.error(result.msg);
            return getState();
        }

        return getState().set("waitList", result.data);
    },
    /**
     * 获取已分配产品list
     * @param {*} state 
     * @param {*} params 
     * @param {*} param2 
     */
    async getAssignedList(state, params, { getState, mutations }) {
        let modalProdQuery = getState().toJS()["modalProdQuery"];
        let treeCheckItem = getState().toJS()["treeCheckItem"];

        let result = await productGroupService.getAssignedList({
            ...modalProdQuery,
            ...params,
            groupCode: treeCheckItem.groupCode,
        });
        if (result.code !== "200") {
            message.error(result.msg);
            return getState();
        }

        return getState().set("assignedList", result.data);
    },
    /**
     * 保存产品组
     * @param {*} state 
     * @param {*} params 
     * @param {*} param2 
     */
    async saveProdGroup(state, params, { getState, mutations }) {
        let result = await productGroupService.saveProdGroup(params);
        if (result.code !== "200") {
            message.error(result.msg);
            return getState();
        }
        message.info("操作成功");
        return getState().merge({
            editGroupModal: {
                type: "ADD",
                isShow: false,
            },
        });
    },
    /**
     * 修改产品组
     * @param {*} state 
     * @param {*} params 
     * @param {*} param2 
     */
    async updateProdGroup(state, params, { getState, mutations }) {
        let result = await productGroupService.updateProdGroup(params);
        if (result.code !== "200") {
            message.error(result.msg);
            return getState();
        }
        message.info("操作成功");
        return getState().merge({
            editGroupModal: {
                type: "ADD",
                isShow: false,
            },
        });
    },
    /**
     * 删除产品组
     * @param {*} state 
     * @param {*} params 
     * @param {*} param2 
     */
    async deleteProdGroup(state, params, { getState, mutations }) {
        let result = await productGroupService.deleteProdGroup(params);
        if (result.code !== "200") {
            message.error(result.msg);
            return getState();
        }
        message.info("操作成功");
        //重新加载树
        mutations.asyncGetProductGroupTree({});
        return getState();
    },
    /**
     * 产品组删除产品
     * @param {*} state 
     * @param {*} params 
     * @param {*} param2 
     */
    async deleteProductInGroup(state, params, { getState, mutations }) {
        let result = await productGroupService.deleteProductInGroup(params);
        if (result.code !== "200") {
            message.error(result.msg);
            return getState();
        }
        message.info("操作成功");
        return getState();
    },
    /**
     * 产品组新增产品
     * @param {*} state 
     * @param {*} params 
     * @param {*} param2 
     */
    async addProductByGroup(state, params, { getState, mutations }) {
        let result = await productGroupService.addProductByGroup(params);
        if (result.code !== "200") {
            message.error(result.msg);
            return getState();
        }
        message.info("操作成功");
        return getState();
    },
};
