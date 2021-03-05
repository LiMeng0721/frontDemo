/**
 * 折叠面板
 * @props Collapse
 * @author zhz 
 */



import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import "./style.less"

class CollapseInfo extends PureComponent {
  state = {
    isShowInfoContanier: !this.props.isshowinfocontanier ? false : this.props.isshowinfocontanier,
    isLock: false,
    isChildrenShow: true,
  }
  render () {
    return (
      <div {...this.props} className="dropDownInfo">
        <div className="infoHeader">
          <span className="infoHeaderContanier" onClick={() => {
            //第一打开面板采用dom渲染的方式
            if (!this.state.isLock) {
              this.setState(() => {
                return {
                  isLock: true,
                  isShowInfoContanier: true
                }
              })
            } else {
              //第一次以后打开面板采用display 的方式打开面板
              this.setState(() => {
                return {
                  isLock: true,
                  isChildrenShow: !this.state.isChildrenShow
                }
              })
            }

          }}>
            <span className="infoHeaderTitle">{this.props.title}</span>
            {this.props.isIconShow ? <Icon type={this.state.isShowInfoContanier && this.state.isChildrenShow ? "caret-up" : "caret-down"} /> : ""}
            <span className="infoHeaderDesc">{this.props.description}</span>
          </span>
        </div>
        {
          this.state.isShowInfoContanier ? <div {...this.props} className="infoContanier" style={{ "display": this.state.isChildrenShow ? "" : "none" }} >
            {this.props.children}
          </div> : ""
        }

      </div>
    );
  }

  componentDidMount () {

  }
  /***设置props默认值 */


}
CollapseInfo.defaultProps = {
  isIconShow: true
}

export default CollapseInfo;
