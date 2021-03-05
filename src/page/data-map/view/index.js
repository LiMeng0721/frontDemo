import React, { PureComponent } from "react";
import {
    SearchForm,
    PageBody,
    PageSide,
    ConfigableTable,
    withRoleBotton,
    withRoleTableBotton,
    Modal,
    setColumns,
    setTableInfo,
    page,
    ConfirmModal
} from "yss-trade-base";
import { message} from "antd";
import DataMapForm from "./DataMapForm";
import dataMapService from "../service/DataMapService";
import DataMapTypeView from "./DataMapTypeView";
import './index.less';
const { mapOption } = SearchForm;
const {PageMain} = PageBody;

class DataMapView extends PureComponent {
    constructor(props) {
        super(props);
        this.getDataTypeList();
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
        dataTypeList: [], // 映射类型下拉数据
    };
    componentDidMount() {
        this.query();
    }
    render() {
        const { tableList, isOpenFormModal, queryElement } = this.state;

        /***查询列表 */
        let SearchformItem = [
            {
                name: "mapType",
                label: "数据映射类型",
                type: "Select",
                options: mapOption(this.state.dataTypeList, "mapTypeName", "mapType"),
                props: {
                    placeholder: "请选择数据映射类型",
                    allowClear: true
                },
            },
            {
                name: "dataCode",
                label: "数据编码",
                type: "Input",
                props: {
                    placeholder: "请输入数据编码",
                },
            },
            {
                name: "dataName",
                label: "数据名称",
                type: "Input",
                props: {
                    placeholder: "请输入数据名称",
                },
            },
            {
                name: "mapDataCode",
                label: "映射编码",
                type: "Input",
                props: {
                    placeholder: "请输入映射编码",
                },
            },
        ];

        /***按钮组***/
        const ButtonType = [
            {
                name: "新增",
                func: () => {
                    //打开新增模态框
                    this.openFormModal({ type: "add", status: true, sign: "dataMap" });
                },
                "func-code": "DATA_MAP_ADD", // 新按钮权限
                "func-type": "ADD", //旧按钮权限
            },
            {
                name: "维护类型",
                roule: true,
                func: () => {
                    this.openFormModal({ type: "add", status: true, sign: "dataMapType" });
                },
                "func-code": "DATA_MAP_MAINTAIN",
                "func-type": "OTHER_OPERATION",
            },
        ];

        /***表格行按钮组***/
        const ButtonTableType = [
            {
                name: "修改",
                roule: true,
                func: this.updateItem,
                "func-code": "DATA_MAP_UPDATE",
                "func-type": "UPDATE",
            },
            {
                name: "删除",
                roule: true,
                type: "assetAccount",
                func: this.deleteItem,
                "func-code": "DATA_MAP_DELETE",
                "func-type": "DELETE",
            },
        ];

        /** 表格列 **/
        const tableColumns = [
            {
                title: "序号",
                dataIndex: "serialNumber",
                key: "serialNumber",
                width: 200,
            },
            {
                title: "数据映射类型",
                width: 200,
                dataIndex: "mapType",
                key: "mapType",
            },
            {
                title: "数据映射名称",
                dataIndex: "mapTypeName",
                key: "mapTypeName",
                ellipsis: true,
                width: 200,
            },
            {
                title: "数据编码",
                dataIndex: "dataCode",
                key: "dataCode",
                ellipsis: true,
                width: 150,
            },
            {
                title: "数据名称",
                dataIndex: "dataName",
                key: "dataName",
                ellipsis: true,
                width: 200,
            },
            {
                title: "数据映射编码",
                dataIndex: "mapDataCode",
                key: "mapDataCode",
                ellipsis: true,
                width: 150,
            },
            {
                title: "操作人",
                key: "createUserName",
                width: 150,
                render: (text,record) => {
                    return record.updateUserName ? record.updateUserName : record.createUserName;
                },
            },
            {
                title: "操作时间",
                key: "createTime",
                width: 150,
                ellipsis: true,
                render: (text,record) => {
                    return record.updateTime ? record.updateTime : record.createTime;
                },
            },
            {
                title: "操作",
                key: "operation",
                width: 360,
                fixed: "right",
                align: "center",
                render: (text,row) => {
                    return withRoleTableBotton(ButtonTableType)(row);
                },
            },
        ];
        //加上通用的列设置
        const columns = setColumns(tableColumns);

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
            <PageBody>
                <PageMain>
                <div style={{ paddingTop: "10px" }}>
                    <PageSide type='height' >
                        <SearchForm
                            labelSize="6em"
                            lineOf={3}
                            formItem={SearchformItem}
                            refs={(ref) => (this.searchForm = ref)}
                            handleSearch={(value) => {
                                this.query(value);
                            }}
                            handleBeforeReset={() => {
                                //重置以后进行查询
                                this.query();
                            }}
                        />
                    </PageSide>
                </div>
                {/* 设置按钮的显示方式和权限 */}
                {withRoleBotton(ButtonType,'')}
                <ConfigableTable
                    // 设置通用的表格属性
                    {...setTableInfo({
                        columns,
                        dataSource: tableList,
                        pagination,
                        rowKey: "id",
                        height: 'calc(100vh - 390px)'
                    })}
                />
                {/* 数据新增和修改的form表单模态框 */}
                {isOpenFormModal.sign === "dataMap" ? (
                    <Modal
                        width={750}
                        title={
                            isOpenFormModal.type === "update"
                                ? "修改数据"
                                : isOpenFormModal.type === "add"
                                ? "增加数据"
                                : "查看"
                        }
                        visible={isOpenFormModal.status}
                        onCancel={() => {
                            this.openFormModal({ type: "add", status: false, sign: "" });
                        }}
                    >
                        <DataMapForm
                            dataTypeList={this.state.dataTypeList}
                            type={this.state.isOpenFormModal.type}
                            saveSuccess={this.saveSuccess}
                            selectData={this.state.selectData}
                        ></DataMapForm>
                    </Modal>
                ) : (
                    ""
                )}
                {/* 数据映射类型列表界面模态框 */}
                {isOpenFormModal.sign === "dataMapType" ? (
                    <Modal
                        className="dataMapTypeModal"
                        width={900}
                        title="数据映射类型"
                        visible={isOpenFormModal.status}
                        onCancel={() => {
                            this.openFormModal({ type: "add", status: false, sign: "" });
                            this.getDataTypeList();
                        }}
                        footer={null}
                    >
                        <DataMapTypeView />
                    </Modal>
                ) : (
                    ""
                )}
                </PageMain>
            </PageBody>
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
    query = async value => {
        value =  value !== undefined ? {...value,...this.state.queryElement} : this.state.queryElement
        await dataMapService.getDataMapPageList(value).then((result)=>{
          const { code, data ,msg } = result;
          if(code === '200'){
              this.setState({
                  tableList: data.list,
                  total: data.total
              })
          } else {
            message.error(msg);
          }
        })
      }
    /**
     * 修改表格行的数据
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
                    sign: "dataMap",
                });
            }
        );
    };

    /**
     * 删除表格一行
     */
    deleteItem = (e, item) => {
        e.stopPropagation();
        ConfirmModal({
            title: "是否要删除该条数据",
            onOk: async () => {
                await dataMapService.deleteDataMap(item.id).then((res) => {
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
     * 获取数据映射类型的下拉数据
     * */
    getDataTypeList = async () => {
        await dataMapService.getDataTypeList().then((result) => {
            const { code, data } = result;
            if (code === "200") {
                this.setState({
                    dataTypeList: data,
                });
            }
        });
    };
    /**
     * 保存成功
     */
    saveSuccess = () => {
        this.openFormModal({ type: "add", status: false, sign: "" });
        this.searchForm.onSearch();
    };
}

export default DataMapView;
