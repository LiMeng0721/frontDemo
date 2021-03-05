import React, { useContext, useState, useEffect } from "react";
import { Tree, Button, Input } from "antd";
import { Modal, PublicProps } from "yss-trade-base";
import AddOrUpdateGroup from "./AddOrUpdateGroup";
const { Search } = Input;
const LeftTree = () => {
    const {
        productGroupTreeData,
        treeList,
        setModelData,
        treeCheckItem,
        asyncGetProductGroupTree,
        formartMenuTree,
        changeTreeKeys,
        asyncGetProductList,
        editGroupModal,
        productQuery,
    } = useContext(PublicProps);
    const [queryValue, setQueryValue] = useState("");
    const { keys, rows } = productGroupTreeData;

    //hooks初始化执行一次
    useEffect(() => {
        asyncGetProductGroupTree({});
    }, []);

    //监听treeList,queryValue有变化执行
    useEffect(() => {
        formartMenuTree({ treeList, queryValue });
        setInputGroupList();
    }, [JSON.stringify(treeList), JSON.stringify(queryValue)]);

    //搜索值
    const searchValueChange = (value) => {
        setQueryValue(value);
    };
    //展开
    const changeExpand = (expandedKeys) => {
        changeTreeKeys(expandedKeys);
    };

    //选择的节点
    const onSelect = (checkedKeys, e) => {
        const checkedKey = checkedKeys[0];
        const curGroup = e.selectedNodes[0].props;
        setModelData({
            treeCheckItem: curGroup,
            assignedList:[],
            waitList:[],
            productQuery: {
                ...productQuery,
                groupCode: checkedKey,
            },
            tableLoading : true,
        })
        asyncGetProductList();
    };

    //隐藏弹窗
    const hideModel = () => {
        setModelData({
            editGroupModal: {
                type: "ADD",
                isShow: false,
            },
        });
    };

    //新增产品组
    const addGroup = () => {
        setModelData({
            editGroupModal: {
                type: "ADD",
                isShow: true,
            },
        });
    };

    //设置级联下拉框选项
    const setInputGroupList = () => {
        const optionList = getInputGroupList(treeList);
        setModelData({
            inputGroupList: optionList,
        });
    };
    //递归获取级联下拉框选项
    const getInputGroupList = (treeList = []) => {
        let optionList = [];
        treeList.forEach((item) => {
            let option = {
                label: item["groupName"],
                value: item["groupCode"],
                key: item["groupCode"],
                datas: item,
            };
            if (item.children && item.children.length) {
                option["children"] = getInputGroupList(item.children);
                option["isLeaf"] = false;
            }

            optionList.push(option);
        });
        return optionList;
    };

    return (
        <div style={{ height: "90%" }}>
            <div className="treeExpand">
                <Button
                    icon="plus"
                    type="link"
                    className="button-link"
                    onClick={() => {
                        addGroup();
                    }}
                >
                    增加
                </Button>
                <span>产品组</span>
            </div>
            <Search
                placeholder="请输入查询"
                allowClear
                onChange={(e) => searchValueChange(e.target.value)}
                className="searchIcon"
                style={{ width: "calc(100% - 12px)", marginTop: "15px" }}
            />
            <div className="leftRree">
                <Tree.DirectoryTree
                    onSelect={(checkedKeys, e) => onSelect(checkedKeys, e)}
                    expandedKeys={keys}
                    treeData={rows || []}
                    selectedKeys={treeCheckItem ? [treeCheckItem.groupCode] : ""}
                    onExpand={changeExpand}
                ></Tree.DirectoryTree>
            </div>
            <Modal
                title={editGroupModal.type === "ADD" ? "新增产品组" : "修改产品组"}
                okText="确定"
                cancelText="取消"
                destroyOnClose={true}
                width={480}
                maskClosable={false}
                visible={editGroupModal.isShow}
                onCancel={hideModel}
            >
                <AddOrUpdateGroup {...useContext(PublicProps)} />
            </Modal>
        </div>
    );
};
export default LeftTree;
