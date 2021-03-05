import { Button, Col, message, Row } from "antd";
import React, { useContext, useState } from "react";
import { ConfigableTable, PublicProps, SearchForm, setTableInfo,PageSide } from "yss-trade-base";

const ProductGroupCfg = () => {
    //从全局context中获取状态
    const {
        waitList,
        assignedList,
        treeCheckItem,
        setModelData,
        asyncAddProductByGroup,
        asyncDeleteProductInGroup,
        asyncGetWaitList,
        asyncGetAssignedList,
    } = useContext(PublicProps);
    //局部state定义
    const [waitSelectedRows, setWaitSelectedRows] = useState([]);
    const [assignedSelectedRows, setAssignedSelectedRows] = useState([]);
    const [waitSelectedRowKeys, setWaitSelectedRowKeys] = useState([]);
    const [assignedSelectedRowKeys, setAssignedSelectedRowKeys] = useState([]);

    //获取查询框条件
    const getFormConfig = () => {
        const formItem = [
            {
                name: "prodFullName",
                label: "产品",
                type: "Input",
                props: {
                    placeholder: "请选择产品",
                    onChange(value) {},
                },
            },
            {
                name: "assetType",
                label: "资产类型",
                type: "Select",
                props: {
                    placeholder: "请选择资产类型",
                    getDics: "1000082",
                },
            },
            {
                name: "assetClass",
                label: "资产类别",
                type: "Select",
                props: {
                    placeholder: "请选择资产类别",
                    getDics: "1000083",
                },
            },
            {
                name: "assetKind",
                label: "资产种类",
                type: "Select",
                props: {
                    placeholder: "请选择资产种类",
                    getDics: "1000084",
                },
            },
        ];
        return {
            formItem,
            labelSize: "5em",
            lineOf: 2,
            handleSearch: (values) => {
                setModelData({
                    modalProdQuery: values,
                });
                asyncGetWaitList({});
                asyncGetAssignedList({});
            },
        };
    };

    const columns = [
        {
            title: "序号",
            width: 70,
            dataIndex: "serialNumber",
            key: "serialNumber",
            render: (text, record, index) => {
                if (record.serialNumber == "合计") {
                    return <span style={{ color: "#E6A23C", fontWeight: "bolder" }}>合计</span>;
                } else {
                    return ++index; //++index相当于index+1
                }
            },
        },
        {
            title: "产品代码",
            dataIndex: "prodCode",
            key: "prodCode",
            width: 100,
            ellipsis: true,
        },
        {
            title: "产品名称",
            dataIndex: "prodShortName",
            key: "prodShortName",
            width: 150,
            ellipsis: true,
        },
        {
            title: "资产类型",
            dataIndex: "assetTypeName",
            key: "assetTypeName",
            width: 150,
            ellipsis: true,
        },
        {
            title: "资产类别",
            dataIndex: "assetClassName",
            key: "assetClassName",
            width: 150,
            ellipsis: true,
        },
        {
            title: "资产种类",
            dataIndex: "assetKindName",
            key: "assetKindName",
            width: 150,
            ellipsis: true,
        },
    ];

    //待分配复选框
    const waitRowSelection = {
        selectedRowKeys: waitSelectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setWaitSelectedRowKeys(selectedRowKeys);
            setWaitSelectedRows(selectedRows);
        },
    };
    //已分配复选框
    const assignedRowSelection = {
        selectedRowKeys: assignedSelectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setAssignedSelectedRowKeys(selectedRowKeys);
            setAssignedSelectedRows(selectedRows);
        },
    };
    //移动到未分配
    const moveWait = () => {
        if (assignedSelectedRows && assignedSelectedRows.length > 0) {
            let params = [];
            assignedSelectedRows.forEach((item) => {
                let prod = {
                    groupCode: treeCheckItem.groupCode,
                    prodCode: item.prodCode,
                };
                params.push(prod);
            });
            asyncDeleteProductInGroup(params).then(() => {
                setWaitSelectedRows([]);
                setAssignedSelectedRows([]);
                setWaitSelectedRowKeys([]);
                setAssignedSelectedRowKeys([]);
                let newWaitList = [...assignedSelectedRows, ...waitList];
                let newAssignedList = assignedList.filter((item) => {
                    let curIndex = assignedSelectedRows.findIndex((ass) => {
                        return item.prodCode === ass.prodCode;
                    });
                    return curIndex === -1;
                });
                setModelData({
                    waitList: newWaitList,
                    assignedList: newAssignedList,
                });
            });
        } else {
            message.warn("请选择需要移动的产品");
        }
    };
    //移动到已分配
    const moveAssigned = () => {
        if (waitSelectedRows && waitSelectedRows.length > 0) {
            let params = [];
            waitSelectedRows.forEach((item) => {
                let prod = {
                    groupCode: treeCheckItem.groupCode,
                    prodCode: item.prodCode,
                };
                params.push(prod);
            });
            asyncAddProductByGroup(params).then(() => {
                setWaitSelectedRows([]);
                setAssignedSelectedRows([]);
                setWaitSelectedRowKeys([]);
                setAssignedSelectedRowKeys([]);
                let newAssignedList = [...waitSelectedRows, ...assignedList];
                let newWaitList = waitList.filter((item) => {
                    let curIndex = waitSelectedRows.findIndex((wait) => {
                        return item.prodCode === wait.prodCode;
                    });
                    return curIndex === -1;
                });
                setModelData({
                    waitList: newWaitList,
                    assignedList: newAssignedList,
                });
            });
        } else {
            message.warn("请选择需要移动的产品");
        }
    };
    return (
        <div>
            <Row>
                <PageSide>
                    <SearchForm {...getFormConfig()} />
                </PageSide>
            </Row>
            <Row>
                <Col span={11}>
                    <div className="table-title">
                        <span>待分配产品</span>
                    </div>
                    <ConfigableTable
                        {...setTableInfo({
                            columns,
                            dataSource: waitList,
                            rowKey: "prodCode",
                            height: "500px",
                            pagination: false,
                            rowSelection: waitRowSelection,
                        })}
                    />
                </Col>
                <Col span={2}>
                    <div className="group-move-button">
                        <Button icon="arrow-right" shape="round" onClick={moveAssigned}></Button>
                        <Button icon="arrow-left" shape="round" onClick={moveWait}></Button>
                    </div>
                </Col>
                <Col span={11}>
                    <div className="table-title">
                        <span>已分配产品</span>
                    </div>
                    <ConfigableTable
                        {...setTableInfo({
                            columns,
                            dataSource: assignedList,
                            rowKey: "prodCode",
                            height: "500px",
                            pagination: false,
                            rowSelection: assignedRowSelection,
                        })}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default ProductGroupCfg;
