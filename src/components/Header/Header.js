import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Row, Col, Avatar, Select, Layout } from 'antd';
import { SecurityScanOutlined, BarsOutlined, UserOutlined, LogoutOutlined }
    from '@ant-design/icons';
import cookie from 'react-cookies';
import { withRouter } from "react-router-dom";


import logo from "../../assets/images/logo.png"
import "./style.css"


class Logo extends React.Component {
    render() {
        return (
            <div className="logo">
                <Link to="/">
                    <img src={logo} alt="logo" />
                </Link>
            </div>
        );
    }
};


class User extends React.Component {
    state = {
        hasLogin: false,
        user: {
            name: null,
            avatarUrl: null
        }
    };

    componentDidMount() {
        let username = cookie.load("username");
        if (username) {
            let avatarUrl = cookie.load("avatarUrl");
            this.setState({
                hasLogin: true,
                user: {
                    name: username,
                    avatarUrl: avatarUrl
                }
            });
        }
    }
    goUserSelfPage = () => {
        window.open('about:blank').location.href = `https://github.com/${this.state.user.name}`;
    }
    logout = () => {
        cookie.remove("username");
        cookie.remove("avatarUrl");
        console.log("logout");
        this.setState({
            hasLogin: false,
            user: {
                name: "",
                avatarUrl: ""
            }
        });
    }
    renderUserInfo() {
        if (this.state.hasLogin) {
            return <div className="user">
                <Avatar src={this.state.user.avatarUrl} style={{ marginRight: 10, cursor: "pointer" }} onClick={this.goUserSelfPage} />
                <Select value={this.state.user.name}>
                    <Layout >
                        <div onClick={this.logout} >
                            <LogoutOutlined style={{ paddingRight: 10 }} />
                            logout
                        </div>
                    </Layout>
                </Select>
            </div >;
        } else {
            return <a href={global.LoginUrl} className="no-login-user">
                <UserOutlined />
                <span>Login</span>
            </a>;
        }
    }

    render() {
        return this.renderUserInfo();
    }
};

@withRouter
class Header extends React.Component {
    renderMenu() {
        if (this.props.location.pathname != "/") {
            let selectKey = ["scan"];
            if (this.props.location.pathname === "/components") {
                selectKey = ['components'];
            }
            return <Menu className="menu" theme="light" mode="horizontal" selectedKeys={selectKey}>
                <Menu.Item key="scan" icon={<SecurityScanOutlined />} >
                    <Link to="/scan">
                        scan
                    </Link>
                </Menu.Item>
                <Menu.Item key="components" icon={<BarsOutlined />} >
                    <Link to="/components">
                        components
                    </Link>
                </Menu.Item>
            </Menu>
        }
    }

    render() {
        return (
            <Row className="header">
                <Col span={6}>
                    <Logo />
                </Col>
                <Col span={12}>
                    {this.renderMenu()}
                </Col>
                <Col span={6}>
                    <User />
                </Col>
            </Row>
        );
    }
};


export default Header
export { Logo, User }