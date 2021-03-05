import React, { PureComponent } from "react";
import {
    SearchForm,
    ConfigableTable,
    withRoleBotton,
    withRoleTableBotton,
    Modal,
    setColumns,
    setTableInfo,
    page,
    PageSide
} from "yss-trade-base";
import { modal, message } from "antd";
import dataMapService from "../service/DataMapService";
import DataMapTypeForm from './DataMapTypeForm';
/**
 * 数据映射类型
 */
class DataMapTypeView extends PureComponent {
    constructor(props) {
        super(props);
    }
    state = {
        isOpenFormModal: {
            type: "add",
            status: false,
        },
        tableList: [],
        total: 0,
        /**资金模糊查询条件*/
        queryElement: {
            ...page,
        },
        selectData: {}, //当前修改的数据
    };
    componentDidMount() {
        this.query();
    }
    render() {
        const { tableList, isOpenFormModal, queryElement } = this.state;

        /***查询条件 */
        let SearchformItem = [
            {
                name: "mapType",
                label: "映射类型",
                type: "Input",
                props: {
                    placeholder: "请输入映射类型",
                },
            },
            {
                name: "mapTypeName",
                label: "映射名称",
                type: "Input",
                props: {
                    placeholder: "请输入映射名称",
                },
            },
        ];

        /***按钮组***/
        const ButtonType = [
            {
                name: "新增",
                func: () => {
                    this.openFormModal({ type: "add", status: true, sign: "dataMapType" });
                },
            },
        ];

        /***表格行按钮组***/
        const ButtonTableType = [
            {
                name: "修改",
                roule: true,
                func: this.updateItem,
            },
            {
                name: "删除",
                roule: true,
                type: "assetAccount",
                func: this.deleteItem,
            },
        ];
        //表格列
        const tableColumns = [
            {
                title: "序号",
                dataIndex: "serialNumber",
                key: "serialNumber",
                width: 200,
            },
            {
                title: "映射类型",
                width: 230,
                dataIndex: "mapType",
                key: "mapType",
            },
            {
                title: "映射名称",
                dataIndex: "mapTypeName",
                key: "mapTypeName",
                ellipsis: true,
                width: 220,
            },
            {
                title: "备注",
                dataIndex: "remark",
                key: "remark",
                ellipsis: true,
                width: 150,
            },
            {
                title: "操作",
                key: "operation",
                width: 150,
                fixed: "right",
                align: "center",
                render: (text,row) => {
                    return withRoleTableBotton(ButtonTableType)(row);
                },
            },
        ];
        const columns = setColumns(tableColumns)
        /***表格分页***/
        const pagination = {
            total: this.state.total,
            pageSize: queryElement.reqPageSize,
            onChange: (page, pageSize) => {
                this.searchPage(page, pageSize);
            },
            onShowSizeChange: (current, size) => {
                this.searchPage(current, size);
            },
            showTotal: (total, range) => {
                return <span>{`共${total}条`}</span>;
            },
        };
        return (
            <div className="contanier">
                 <PageSide type='height' >
                    <SearchForm
                        labelSize="5em"
                        formItem={SearchformItem}
                        refs={(ref) => (this.searchForm = ref)}
                        handleSearch={(value) => {
                            this.query(value);
                        }}
                        handleReset={this.handleReset}
                        handleBeforeReset={() => {
                            this.query();
                        }}
                    />
                 </PageSide>
                {withRoleBotton(ButtonType)}
                <ConfigableTable
                    {...setTableInfo({
                        columns,
                        dataSource: tableList,
                        pagination,
                        rowKey: "id",
                        height: 300,
                    })}
                    tableCode='dataMapTypeTable'
                />
                {isOpenFormModal.sign === "dataMapType" ? (
                    <Modal
                        width={750}
                        className='dataMapTypeFormModal'
                        title={
                            isOpenFormModal.type === "update"
                                ? "修改映射数据"
                                : isOpenFormModal.type === "add"
                                ? "增加映射数据"
                                : "查看"
                        }
                        visible={isOpenFormModal.status}
                        onCancel={() => {
                            this.openFormModal({ type: "add", status: false, sign: "" });
                        }}
                    >
                        <DataMapTypeForm
                            type={this.state.isOpenFormModal.type}
                            saveSuccess={this.saveSuccess}
                            selectData={this.state.selectData}
                        ></DataMapTypeForm>
                    </Modal>
                ) : (
                    ""
                )}
            </div>
        );
    }
    /**
     * 是否展示弹框
     * @param {*} param0 
     */
    openFormModal({ type, status, sign }) {
        this.setState({
            isOpenFormModal: {
                type,
                status,
                sign,
            },
        });
    }
    /**
     * 查询
     */
    query = async (value) => {
        value = { ...value, ...this.state.queryElement };
        await dataMapService.getDataMapTypeList(value).then((result) => {
            const { code, data, msg } = result;
            if (code === "200") {
                this.setState({
                    tableList: data.list,
                    total: data.total
                });
            } else {
                message.error(msg);
            }
        });
    };
    /**
     * 修改表格一行
     */
    updateItem = (e, item) => {
        e.stopPropagation();
        this.setState(
            {
                selectData: item,
            },
            () => {
                this.openFormModal({
                    type: "update",
                    status: true,
                    sign: "dataMapType",
                });
            }
        );
    };

    /**
     * 删除表格一行
     */
    deleteItem = (e, item) => {
        e.stopPropagation();
        modal.confirm({
            title: "是否要删除该条数据",
            onOk: async () => {
                await dataMapService.deleteDataMapType(item.id).then((res) => {
                    if (res.code === "200") {
                        message.success("删除成功");
                        this.searchForm.onSearch();
                    } else {
                        message.error(res.msg || "删除失败");
                    }
                });
            },
        });
    };

    /**
     * 分页查询
     */
    searchPage = (reqPageNum, reqPageSize) => {
        this.setState(
            {
                queryElement: {
                    reqPageNum,
                    reqPageSize,
                },
            },
            () => {
                this.searchForm.onSearch();
            }
        );
    };
    /**
     * 保存成功
     */
    saveSuccess = () => {
        this.openFormModal({ type: "add", status: false, sign: "" });
        this.searchForm.onSearch();
    };
}
export default DataMapTypeView;
