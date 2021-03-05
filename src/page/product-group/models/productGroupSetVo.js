import { page } from "yss-trade-base";

export default {
    //所有未分配数据
    allwaitList: [],
    //存放左侧树形结构信息
    productGroupTreeData: {
        keys: [],
        rows: [],
    },
    //默认树节点数
    defaultTreeKey: [],
    //左侧树结构
    treeList: [],
    //左侧选中的树节点
    treeCheckItem: {},
    //新增修改产品组弹窗开关
    editGroupModal: {
        type: "ADD",
        isShow: false,
    },
    updateGroupItem: {},
    //级联选择框
    inputGroupList: [],
    //更新的产品组
    updateGroup: {},
    //产品表格查询条件
    productQuery: {},
    //产品表格分页数据
    productPage: { ...page },
    //产品list
    productList: [],
    //配置产品弹窗开关
    showConfigModal: false,
    //弹窗产品查询条件
    modalProdQuery: {},
    //带分配产品list
    waitList: [],
    //已分配产品List
    assignedList: [],
    //表格加载框
    tableLoading: false,
};
