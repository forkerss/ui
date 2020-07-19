import React from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Button } from 'antd';
import { BlockOutlined }
    from '@ant-design/icons';

import hunter from "../assets/images/hunter.png";
import "./style.css";


@withRouter
class Index extends React.Component {
    render() {
        return (
            <div className="slogo">
                <Row justify="center" align="top">
                    <Col span={6}>
                    </Col>
                    <Col span={12}>
                        <img className="introduce-img" src={hunter}></img>
                        <p className="introduce-text">Analysis web components for security testing.</p>
                        <Button size="large" className="introduce-btn" onClick={() => { this.props.history.push("/scan") }}>Let's hunt it</Button>
                    </Col>
                    <Col span={6}>
                    </Col>
                </Row>
                <Row justify="center" align="bottom">
                    <Col span={6}>
                    </Col>
                    <Col span={12} style={{ minHeight: "75px", marginTop: "150px" }}>
                        <BlockOutlined style={{ fontSize: 50 }} spin={true} />
                    </Col>
                    <Col span={6}>
                    </Col>
                </Row>
            </div >
        )
    }
}

export default Index;