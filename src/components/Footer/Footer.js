import React from 'react';
import { Layout } from "antd";
import { withRouter } from "react-router-dom";
import { BugOutlined } from '@ant-design/icons';

const { Footer } = Layout;

@withRouter
export default class LFooter extends React.Component {
    render() {
        if (this.props.location.pathname != "/") {
            return (
                <Footer style={{ textAlign: 'center', borderTop: "1px solid rgb(219, 215, 215)" }}>
                    Web Hunter 2020 Created by <a href="https://github.com/WebHunt-Kits" >Buzz2d0</a><BugOutlined />
                </Footer>
            );
        }
        return <div></div>;
    }
}