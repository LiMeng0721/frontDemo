import React, { PureComponent } from 'react';
import { message } from 'antd';
import { NormalForm } from 'yss-trade-base';
import dataMapService from '../service/DataMapService';
const { mapOption } = NormalForm;
class DataMapForm extends PureComponent {
    render() {
        //form表单的表单项
        let formItems = [
            {
                label: '数据映射类型',
                width: 200,
                name: 'mapType',
                type: 'Select',
                labelSize: '8em',
                options: mapOption(this.props.dataTypeList, 'mapTypeName', 'mapType'),
                rules: [
                    {
                        required: true,
                        message: '数据映射类型不能为空'
                    }
                ],
                props: {
                    placeholder: '请选择数据映射类型'
                }
            },
            {
                label: '数据编码',
                name: 'dataCode',
                type: 'Input',
                rules: [
                    {
                        required: true,
                        message: '数据编码不能为空'
                    }
                ],
                props: {
                    placeholder: '请输入数据编码'
                },
                width: 200
            },
            {
                label: '数据名称',
                name: 'dataName',
                type: 'Input',
                rules: [
                    {
                        required: true,
                        message: '数据名称不能为空'
                    }
                ],
                props: {
                    placeholder: '请输入数据名称'
                },
                width: 200
            },
            {
                label: '数据映射编码',
                name: 'mapDataCode',
                type: 'Input',
                labelSize: '8em',
                rules: [
                    {
                        required: true,
                        message: '数据映射编码不能为空'
                    }
                ],
                props: {
                    placeholder: '请输入数据映射编码'
                },
                width: 200
            },

        ];
        return (
            <NormalForm
                refs={ref => (this.createData = ref)}
                labelSize= '8em'
                lineOf={2}
                formItem={formItems}
            />
        );
    }

    componentDidMount() {
        this.props.onRef(this);
        //表单初始化，给表单赋值
        if(this.props.type === 'update'){
            this.createData.setValues(this.props.selectData);
        }
    }

    /**
     * 点击确定进行增加左侧树节点操作
     */
    handleSubmit = e => {
        this.createData.props.form.validateFields((err, values) => {
            if (!err) {
                if (this.props.type === 'add') {
                    // 新增
                    dataMapService.addDataMap(values).then((res) => {
                        this.saveCallBack(res);
                    })
                } else {
                    //修改
                    values.id = this.props.selectData.id;
                    dataMapService.updateDataMap(values).then((res) => {
                        this.saveCallBack(res);
                    });
                }
            }
        });
    }
    /**
     * 保存成功以后的回调方法
     */
    saveCallBack = res => {
        if (res.code === '200') {
            message.success('保存成功');
            this.props.saveSuccess();
        } else {
            message.error(res.msg || "保存失败");
        }
    }
}
export default DataMapForm;
