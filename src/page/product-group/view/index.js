import React from "react";
import { PageBody, $connect, PublicProps, PageSide } from "yss-trade-base";
import LeftTree from "./components/LeftTree";
import CenterContent from "./components/CenterContent";
import "./index.less";
const { PageMain } = PageBody;

export default $connect((props) => {
    return (
        //全局context对象下发状态
        <PublicProps.Provider value={props}>
            <PageBody>
                <PageSide type='width' length={310}>
                    <LeftTree />
                </PageSide>
                <PageMain>
                    <CenterContent />
                </PageMain>
            </PageBody>
        </PublicProps.Provider>
    );
}, "product-group");
