import React from "react";
import { Icon, Modal } from "antd";
import { filterTreeData } from "yss-trade-base";

export default {
    /**
     * 设置其它 Model 数据
     *
     * @param {*} state
     * @param {*} values
     * @returns
     */
    setModelData(state, values, { mutations, getState }) {
        return getState().merge(values);
    },
    /**
     * 格式化树数据带过滤
     * 需要先拼接上未分配的产品
     *
     */
    formartMenuTree(state, { treeList, queryValue }, { mutations, getState }) {
        const filterValue = queryValue ? { filterValue: queryValue } : {};
        let waitGroup = {
            groupCode: "0",
            groupName: "未分配",
            type: "prod",
        };
        //默认添加一个未分配的树节点
        let treeData = [waitGroup, ...treeList];
        const productGroupTreeData = filterTreeData(treeData || [], {
            ...filterValue,
            keyField: "groupCode",
            titleField: "groupName",
            treeNodeRender: (node) => {
                //是否为子节点
                return {
                    key: `${node.groupCode}`,
                    title: (
                        <span>
                            <span key="1" className="tree-title">
                                {node.groupName}
                            </span>
                            <span key="2" className="tree-node-tools">
                                {node.type !== "prod" ? (
                                    <span>
                                        <Icon
                                            key="2-1"
                                            type="edit"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                mutations.updateGroup(node);
                                            }}
                                        />
                                        <Icon
                                            key="2-2"
                                            type="delete"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                mutations.deleteGroup(node.groupCode);
                                            }}
                                        />
                                    </span>
                                ) : (
                                    ""
                                )}
                            </span>
                        </span>
                    ),
                };
            },
        });
        productGroupTreeData["keys"] = productGroupTreeData["keys"].filter((item) => item !== "wait");
        return getState().merge({
            productGroupTreeData,
            defaultTreeKey: productGroupTreeData["keys"],
        });
    },
    /**
     * 设置树选中的keys
     * @param {*} state 
     * @param {*} keys 
     * @param {*} param2 
     */
    changeTreeKeys(state, keys, { getState }) {
        let productGroupTreeData = getState().toJS()["productGroupTreeData"];
        return getState().merge({
            productGroupTreeData: {
                ...productGroupTreeData,
                keys,
            },
        });
    },
    /**
     * 修改产品组
     * @param {*} state 
     * @param {*} node 
     * @param {*} param2 
     */
    updateGroup(state, node, { getState }) {
        return getState()
            .set("updateGroupItem", node)
            .merge({
                editGroupModal: {
                    type: "UPDATE",
                    isShow: true,
                },
            });
    },
    /**
     * 删除产品组
     * @param {*} state 
     * @param {*} groupCode 
     * @param {*} param2 
     */
    deleteGroup(state, groupCode, { mutations, getState }) {
        Modal.confirm({
            title: "是否要删除该条数据",
            onOk: () => {
                mutations.asyncDeleteProdGroup({ groupCode });
            },
        });
        return getState();
    },
};
