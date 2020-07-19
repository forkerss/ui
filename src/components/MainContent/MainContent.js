import React from "react";
import { Layout } from "antd";
import { Route, Switch } from "react-router-dom"

import Index from "../../screen/index";
import Scan from "../../screen/scan";
import Components from "../../screen/components";


export default class ContentMain extends React.Component {
    render() {
        return (
            <Layout style={{ backgroundColor: "#ffffff" }}>
                <Switch>
                    <Route exact path="/" component={Index} />
                    <Route exact path="/scan" component={Scan} />
                    <Route exact path="/components" component={Components} />
                </Switch>
            </Layout>
        );
    }
};
