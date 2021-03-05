import React, { PureComponent } from 'react';
import { message } from 'antd';
import { setFieldsObject, NormalForm } from 'yss-trade-base';
import dataMapService from '../service/DataMapService';

class DataMapTypeForm extends PureComponent {
    render() {
        //form表单的表单项
        let formItems = [
            {
                label: '映射类型',
                name: 'mapType',
                type: 'Input',
                rules: [
                    {
                        required: true,
                        message: '映射类型不能为空'
                    },{
                        pattern: /^[A-Z_]+$/,
                        message: '必须为大写字母或-'
                    }
                ],
                props: {
                    disabled: this.props.type === 'update' ?  true : false,
                    placeholder: '请输入映射类型'
                }
            },
            {
                label: '映射名称',
                name: 'mapTypeName',
                type: 'Input',
                rules: [
                    {
                        required: true,
                        message: '映射名称不能为空'
                    }
                ],
                props: {
                    placeholder: '请输入映射名称'
                },
            },
            {
                type: 'Line',
                hidden: true
            },
            {
                label: '备注',
                name: 'remark',
                type: 'TextArea',
                itemSize:'74%',
                props: {
                    placeholder: '请输入备注',
                    rows:'5',
                    maxLength:200
                },
            }
        ];
        return (
            <NormalForm
                refs={ref => (this.createData = ref)}
                labelSize= '6em'
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
     * 点击确定进行增加数据操作
     */
    handleSubmit = e => {
        this.createData.props.form.validateFields((err, values) => {
            if (!err) {
                if (this.props.type === 'add') {
                    // 新增
                    dataMapService.addDataMapType(values).then((res) => {
                        this.saveCallBack(res);
                    })
                } else {
                    //修改
                    values.id = this.props.selectData.id;
                    dataMapService.updateDataMapType(values).then((res) => {
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
export default DataMapTypeForm;
