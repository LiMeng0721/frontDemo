import React, { useContext, useState } from "react";
import ProductGroupCfg from "./ProductGroupCfg";
import { message } from "antd";
import { ConfigableTable, PublicProps, setTableInfo, withRoleBotton, SearchForm, Modal, page,PageSide } from "yss-trade-base";
import ExportModal from "./ExportModal";

const CenterContent = () => {
    const {
        productList,
        setModelData,
        asyncGetProductList,
        treeCheckItem,
        asyncGetAssignedList,
        asyncGetWaitList,
        productQuery,
        productPage,
        productTotal,
        tableLoading,
    } = useContext(PublicProps);
    const [showExportModal, setShowExportModal] = useState(false);
    const [selectedProdCodes, setSelectedProdCodes] = useState([]);
    const [showConfigModal, setShowConfigModal] = useState(false);

    //复选框
    const rowSelection = {
        onChange: (selectedRowKeys, selectedProdRows) => {
            let selectedProdCodes = selectedProdRows.map((item) => item.prodCode);
            setSelectedProdCodes(selectedProdCodes);
        },
    };

    //查询选项
    const getFormConfig = () => {
        const formItem = [
            {
                name: "prodFullName",
                label: "产品名称",
                type: "Input",
                props: {
                    placeholder: "请选择产品名称",
                    onChange(e) {},
                },
            },
        ];
        return {
            formItem,
            labelSize: "5em",
            handleSearch: (values) => {
                query({
                    productQuery: {
                        ...productQuery,
                        prodFullName: values.prodFullName,
                    },
                    tableLoading: true,
                });
            },
            handleBeforeReset: () => {
                query({
                    productQuery: {
                        groupCode: productQuery.groupCode,
                    },
                    productPage: {
                        ...page,
                    },
                    tableLoading: true,
                });
            },
        };
    };

    //隐藏弹窗
    const hideModel = () => {
        setShowConfigModal(false);
        setModelData({
            tableLoading: true,
        });
        asyncGetProductList({});
        setModelData({
            assignedList: [],
            waitList: [],
        });
    };

    //操作按钮组
    const buttons = [
        {
            name: "配置",
            roule: true,
            "func-type": "OTHER_OPERATION",
            "func-code": "CONFIGURATION",
            icon: "edit",
            func: () => {
                const { groupCode } = treeCheckItem;
                if (!groupCode || groupCode === "0") {
                    message.warn("请选择需要配置的产品组");
                    return;
                }
                setModelData({
                    modalProdQuery: {},
                });
                setShowConfigModal(true);
                asyncGetAssignedList({});
                asyncGetWaitList({});
            },
        },
        {
            name: "导出",
            roule: true,
            "func-type": "EXPORT",
            "func-code": "EXPORT",
            func: () => {
                setShowExportModal(true);
            },
        },
    ];

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
            title: "产品组编号",
            dataIndex: "groupCode",
            key: "groupCode",
            width: 200,
            ellipsis: true,
        },
        {
            title: "产品组名称",
            dataIndex: "groupName",
            key: "groupName",
            width: 200,
            ellipsis: true,
        },
        {
            title: "产品代码",
            dataIndex: "prodCode",
            key: "prodCode",
            width: 150,
            ellipsis: true,
        },
        {
            title: "产品名称",
            dataIndex: "prodShortName",
            key: "prodShortName",
            width: 200,
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
        {
            title: "操作人",
            dataIndex: "createUserName",
            key: "createUserName",
            width: 150,
            ellipsis: true,
        },
    ];

    //查询分页方法
    const searchPage = (page, pageSize) => {
        query({ productPage: { reqPageNum: page, reqPageSize: pageSize } });
    };

    //查询方法
    const query = (params) => {
        setModelData(params);
        asyncGetProductList({});
    }

    //表单分页配置信息
    const pagination = {
        onChange: (page, pageSize) => {
            searchPage(page, pageSize);
        },
        onShowSizeChange: (current, size) => {
            searchPage(current, size);
        },
        showTotal: (total, range) => {
            return <span>{`共${total}条`}</span>;
        },
        total: productTotal,
        defaultPageSize: 20,
    };

    return (
        <div>
            <PageSide type='height'>
                <SearchForm {...getFormConfig()} />
            </PageSide>
            {withRoleBotton(buttons,'')}
            <ConfigableTable
                {...setTableInfo({
                    columns,
                    pagination,
                    dataSource: productList,
                    rowSelection,
                    rowKey: "id",
                    height: "calc(100vh - 380px)",
                })}
                tableCode="productTable"
                loading={{ spinning: tableLoading, tip: "正在加载中..." }}
            />
            <Modal
                title={"配置产品组-" + treeCheckItem.groupName}
                width={1200}
                destroyOnClose={true}
                maskClosable={false}
                visible={showConfigModal}
                footer={null}
                onCancel={hideModel}
            >
                <ProductGroupCfg />
            </Modal>
            <ExportModal
                name="产品列表"
                isExportModal={showExportModal}
                url="/dfbp-base-manage/productGroupRela/exportProductRelaExcel"
                selected={{
                    idList: selectedProdCodes, // 当前选中的产品code数组
                }}
                search={{ ...productQuery, ...productPage }}
                onCancel={() => {
                    setShowExportModal(false);
                }}
            />
        </div>
    );
};

export default CenterContent;
