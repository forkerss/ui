import React from 'react';
import { Row, Col, Input, Divider, Comment, Tooltip, Tag, Empty, Button, Popconfirm } from 'antd';
import { LinkOutlined, CheckCircleOutlined, SyncOutlined, CloseCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { observer, inject } from "mobx-react";
import moment from 'moment';

import scanImg from "../assets/images/scanImg.gif";
import { TaskStatus } from "../utils/constant";

const { Search } = Input;
const scanPrefix = (
    <LinkOutlined
        style={{
            fontSize: 16,
            color: '#1890ff',
        }}
    />
);

function renderScanGif() {
    return <div style={{
        marginTop: "8px",
    }}>
        <div style={{
            display: "inline-block",
            width: "110px",
            height: "110px",
            overflow: "hidden",
            borderRadius: "50%",
        }}>
            <img src={scanImg} style={{
                width: "auto",
                height: "100%",
                marginLeft: "-38%",
                marginTop: "-1%"
            }} />
        </div>
    </div>
}

@inject("store")
@observer
class ScanResult extends React.Component {
    isEmpty() {
        return this.props.store.scanState.target === null
    }
    renderTarget() {
        switch (this.props.store.scanState.data.status) {
            case TaskStatus.succ:
                return <Tag icon={<CheckCircleOutlined />} color="success">
                    {this.props.store.scanState.target}
                </Tag>;
            case TaskStatus.running:
                return <Tag icon={<SyncOutlined />} color="processing">
                    {this.props.store.scanState.target}
                </Tag>;
            case TaskStatus.fail:
                return <Tag icon={<CloseCircleOutlined />} color="error">
                    {this.props.store.scanState.target}
                </Tag>;
        }
    }
    renderTooltip() {
        return (
            <Tooltip title={this.props.store.scanState.done.format}>
                <span>{this.props.store.scanState.done.now}</span>
            </Tooltip>
        );
    }
    renderComponent(item) {
        return (<div key={item.name} style={{ display: "inline", borderRadius: "5px", marginRight: "5px", padding: "4px", backgroundColor: "black" }
        } >
            <span style={{ backgroundColor: "black", color: "white" }}>{item.name}
            </span>
            {item.version != undefined ? <span style={{ backgroundColor: "#F19D38", color: "black", marginLeft: "3px", borderRadius: "3px" }}>{item.version}</span> : ""}
        </div >);
    }
    renderResults() {
        if (this.props.store.scanState.data.result) {
            return (
                <div>
                    {this.props.store.scanState.data.result.map((value) => this.renderComponent(value))}
                    <Popconfirm
                        title="Are you sure retry scan this task?"
                        onConfirm={() => this.props.store.scanTarget(this.props.store.scanState.target, true)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger icon={<ReloadOutlined />} />
                    </Popconfirm>

                </div>
            );

        }
        return <div></div>;

    }
    render() {
        if (this.isEmpty()) {
            return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data" />
        } else {
            return <Comment
                author={this.renderTarget()}
                content={this.renderResults()}
                datetime={this.renderTooltip()}
            />
        }
    }
}

@inject("store")
@observer
class Scan extends React.Component {
    componentWillUnmount() {
        if (this.props.store.scanDoneNowTimer != undefined) {
            clearInterval(this.props.store.scanDoneNowTimer);
        }
    }
    render() {
        return (
            <Row justify="center">
                <Col span={6}>

                </Col>
                <Col span={12} style={{ textAlign: "center" }}>
                    {renderScanGif()}
                    <Search
                        placeholder="input scan url"
                        prefix={scanPrefix}
                        onSearch={value => this.props.store.scanTarget(value, false)}
                        style={{ maxWidth: 500, marginTop: "10px" }}
                        size="large"
                        enterButton
                    />
                    <Divider plain></Divider>
                    <ScanResult />
                </Col>
                <Col span={6}>

                </Col>
            </Row>
        );
    }
}

export default Scan;
