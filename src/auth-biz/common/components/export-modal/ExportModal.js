// 导出组件 带弹窗
/** 
  传入值
  * @params isExportModal Boolean 必填 控制显示隐藏的状态 
  * @params url String 必填 请求导出的后端接口地址
  * @params name String 必填 当前导出的文件名
  * @params selected Object { keyName: [] }  当前选中项的id数组 不填写时点击导出当前项会有提示. keyName为你对接接口中查询选中列表所需的字段名 例如我使用的接口键值为 idList 那么 selected: { idList: [1, 2, 3, 4] }
  * @params search Object  当前查询的查询条件 查询列表传什么就传什么
  * @params onCancel Function 点击取消时需要执行的函数 一般为设置isExportModal值为false
  * 
  * 完整参数示例： 
  *     const rowSelection = { ...rowSelectionFunc.call(this) }; // 当前选中的id数组
        const { isExportModal } = this.state;
        const exportProps = {
          isExportModal: isExportModal, // 控制显示隐藏的变量
          url: 'dfas-communication/message/template/export', // 请求地址
          selected: {
              idList: rowSelection.selectedRowKeys // 当前选中的id数组
          }, // 当前选中行
          name: '消息模板列表', // 导出文件名
          search: this.props.queryElement
        
        }
        <ExportModal onCancel={() => {
            this.setState({
                isExportModal: false,
            });
        }} {...exportProps}></ExportModal>
**/
import React, { Component } from 'react';
import { Form, Row, Col, message, Modal } from 'antd';
import { FormValidItem } from 'win-trade-base';
import { RadioGroup, exportFile, filterNullElement } from 'yss-trade-base';
@Form.create()
class ExportModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isExportModal: false,
			flag: true, // 是否允许打开弹窗
		};
	}
	// componentWillReceiveProps(nextProps) {
	//   console.log(nextProps)
	//   //判断如果props发生改变
	//   if (nextProps.isExportModal !== this.state.isExportModal) {
	//     this.setState({
	//       isExportModal: this.props.isExportModal
	//     });
	//   }
	// }
	static getDerivedStateFromProps(nextProps, prevState) {
		//该方法内禁止访问this
		if (nextProps.isExportModal !== prevState.isExportModal) {
			//通过对比nextProps和prevState，返回一个用于更新状态的对象
			return {
				isExportModal: nextProps.isExportModal,
			};
		}
		//不需要更新状态，返回null
		return null;
	}
	render() {
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 6 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 18 },
			},
		};
		const { getFieldDecorator } = this.props.form;
		const { isExportModal } = this.state;
		return (
			<div>
				<Modal
					width={600}
					title={'导出'}
					visible={isExportModal}
					onCancel={this.props.onCancel}
					onOk={() => {
						this.handleSubmit();
					}}
				>
					<Form name="templateForm">
						<Row>
							<Col span={24}>
								<FormValidItem label="导出类型" {...formItemLayout}>
									{getFieldDecorator('exportName', {
										rules: [
											{
												required: true,
												message: `导出类型必须选择`,
											},
										],
										initialValue: 'page',
									})(
										<RadioGroup
											options={[
												{ label: '导出当前页', value: 'page' },
												{ label: '全部导出', value: 'all' },
												{ label: '导出选中', value: 'row' },
											]}
											isNeedAll={false}
										/>
									)}
								</FormValidItem>
							</Col>
						</Row>
						<Row>
							<Col span={24}>
								<FormValidItem label="导出文件格式" {...formItemLayout}>
									{getFieldDecorator('exportType', {
										rules: [
											{
												required: true,
												message: `文件格式必须选择`,
											},
										],
										initialValue: 'xls',
									})(<RadioGroup getDics="1000081" isNeedAll={false} />)}
								</FormValidItem>
							</Col>
						</Row>
					</Form>
				</Modal>
			</div>
		);
	}
	// 导出全部
	exportAll = (values) => {
		const { url, search, name } = this.props;
		delete search.reqPageSize;
		delete search.reqPageNum;
		exportFile(url, { exportType: values.exportType, ...filterNullElement(search) }, name, true);
	};
	// 导出当前页
	exportCurent = (values) => {
		const { url, search, name, selected, curPageIdList } = this.props;
		exportFile(url, { ...curPageIdList, exportType: values.exportType, ...filterNullElement(search) }, name, false);
	};
	// 导出选中
	exportSelected = (values) => {
		const { url, name, selected, search } = this.props;
		// 判断对象中的匿名数组是否长度为0
		let flag = false;
		for (const i in selected) {
			if (selected[i] && selected[i].length > 0) {
				flag = true;
			}
		}
		if (!flag) {
			message.error('请先勾选表格中需要导出的数据');
			return false;
		}
		delete search.reqPageSize;
		delete search.reqPageNum;
		exportFile(url, { ...selected, exportType: values.exportType, ...filterNullElement(search) }, name, false);
	};
	async handleSubmit(e) {
		const { form } = this.props;
		form.validateFields((err, values) => {
			console.log(err, values);
			if (!err) {
				const exportName = values.exportName;
				switch (exportName) {
					case 'page':
						this.exportCurent(values);
						break;
					case 'all':
						this.exportAll(values);
						break;
					case 'row':
						this.exportSelected(values);
						break;
					default:
						break;
				}
				this.props.onCancel();
			}
		});
	}
}
export default ExportModal;
