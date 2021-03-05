import React from "react";
import { NormalForm } from "yss-trade-base";

export default class AddOrUpdateGroup extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { onRef, editGroupModal, inputGroupList, updateGroupItem } = this.props;
        onRef && onRef(this);
        if (editGroupModal.type === "UPDATE") {
            const parentGroupCode = this.getGroupCodes(inputGroupList, updateGroupItem.groupCode);
            this.formObject.setValues({ ...this.props.updateGroupItem, parentGroupCode });
        }
    }

    /**
     * 获取选中的产品组和父节点
     */
    getGroupCodes = (rows, checkedKey) => {
        const groupCodes = [];
        const findGroupCode = (rows, checkedKey) => {
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].value === checkedKey) {
                    groupCodes.push(rows[i].value);
                    return true;
                }
                if (rows[i].children && rows[i].children.length) {
                    if (findGroupCode(rows[i].children, checkedKey)) {
                        groupCodes.push(rows[i].value);
                        return true;
                    }
                }
            }
        };
        findGroupCode(rows, checkedKey);
        groupCodes.reverse();
        groupCodes.pop();
        return groupCodes;
    };
    /**
     * modal操作保存所有数据
     * @param {*} e 
     */
    handleSubmit(e) {
        e.preventDefault();
        const formObj = this.formObject;
        formObj.onValidate((values) => {
            const {
                asyncSaveProdGroup,
                asyncUpdateProdGroup,
                asyncGetProductGroupTree,
                editGroupModal,
                updateGroupItem,
            } = this.props;
            const fromValues = formObj.getValues();
            const parentGroupCode =
                fromValues.parentGroupCode && fromValues.parentGroupCode.length > 0
                    ? fromValues.parentGroupCode[fromValues.parentGroupCode.length - 1]
                    : 0;
            if (editGroupModal.type === "ADD") {
                asyncSaveProdGroup({
                    groupName: fromValues.groupName,
                    parentGroupCode,
                }).then(() => {
                    asyncGetProductGroupTree({});
                });
            } else {
                asyncUpdateProdGroup({
                    groupCode: updateGroupItem.groupCode,
                    groupName: fromValues.groupName,
                    parentGroupCode,
                }).then(() => {
                    asyncGetProductGroupTree({});
                });
            }
        });
    }

    /**
     * 处理级联菜单
     */
    getGroupList = (groupList=[],checkedKey)=>{
        let optionList = [];
        groupList.forEach((item) => {
            if(item.value === checkedKey){
                item.disabled = true;
            }
            if (item.children && item.children.length) {
                item["children"] = this.getGroupList(item.children,checkedKey);
            }

            optionList.push(item);
        });
        return optionList;
    }
    /**
     * 获取表单配置项
     */
    getFormConfig() {
        const { inputGroupList, editGroupModal, updateGroupItem } = this.props;
        let groupList = JSON.parse(JSON.stringify(inputGroupList));
        //修改的時候级联菜单中本身节点不可以用
        if(editGroupModal.type === "UPDATE"){
            groupList = this.getGroupList(groupList,updateGroupItem.groupCode);
        }
        const formItem = [
            {
                name: "groupName",
                label: "产品组名称",
                type: "Input",
                rules: [
                    {
                        required: true,
                        message: "产品组名称不能为空",
                    },
                ],
                props: {
                    placeholder: "请输入产品组名称",
                },
            },
            {
                name: "parentGroupCode",
                label: "上级",
                type: "Cascader",
                options: groupList,
                props: {
                    placeholder: "请选择上级产品组",
                    disabled: false,
                    changeOnSelect:true,
                    onChange: (value, selectedOptions) => {},
                },
            },
        ];
        return {
            ...this.props,
            formItem,
            labelSize: "10em",
        };
    }

    render() {
        return <NormalForm {...this.getFormConfig()} refs={(ref) => (this.formObject = ref)}></NormalForm>;
    }
}
