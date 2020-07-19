import React from "react";
import { Row, Col, BackTop, Button, Form, Radio, Input, Divider, Spin, List, Statistic } from "antd";
import InfiniteScroll from 'react-infinite-scroller';
import { observer, inject } from "mobx-react";
import { ComponentType, Letters } from "../utils/constant";


const { Search } = Input;

@inject("store")
@observer
class InitialsSelect extends React.Component {
    state = {
        checked: null
    }
    select(value) {
        this.props.store.selectvalue("first", value);
        this.setState({ checked: value });
    }
    renderLetter(value) {
        let type = "link";
        if (this.state.checked == value) {
            type = "primary";
        }
        // when letter value is null, display 'all'.
        return <Button type={type} shape="circle" onClick={() => this.select(value)}> {value === null ? "all" : value} </Button >
    }
    render() {
        return (
            <Radio.Group>
                {Letters.map((value) => this.renderLetter(value))}
            </Radio.Group>
        );
    }
}

@inject("store")
@observer
class Select extends React.Component {
    renderTypeRadio(key) {
        return <Radio value={ComponentType[key]} onClick={() => this.props.store.selectvalue("type", ComponentType[key])}>{key}</Radio>
    }
    render() {
        return (
            <Form name="Select">
                <Form.Item
                    label="首字母"
                    name="first"
                    style={{ paddingTop: "5px" }}
                >
                    <InitialsSelect />
                </Form.Item>
                <Form.Item name="type" label="类型">
                    <Radio.Group defaultValue={null}>
                        {Object.keys(ComponentType).map((key) => this.renderTypeRadio(key))}
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="name" label="名称">
                    <Search
                        placeholder="输入组件名"
                        onSearch={value => this.props.store.selectvalue("name", value)}
                        style={{ width: 200 }}
                    />
                </Form.Item>
            </Form >
        );
    }
}


@inject("store")
@observer
class Components extends React.Component {
    componentDidMount() {
        this.props.store.fetchComponents();
    }
    handleInfiniteOnLoad = () => {
        this.props.store.componentsState.loading = true;
        this.props.store.fetchComponents();
        this.props.store.componentsState.loading = false;
    }
    substrItem(desc) {
        if (desc === null) return "no description";
        return desc.length > 30 ? desc.substr(0, 50) + "..." : desc;
    }
    renderComponentsList = () => {
        return (
            <InfiniteScroll
                initialLoad={false}
                pageStart={0}
                loadMore={this.handleInfiniteOnLoad}
                hasMore={this.props.store.componentsHasMore()}
            >
                <List
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 4,
                        lg: 4,
                        xl: 6,
                        xxl: 3,
                    }}
                    dataSource={this.props.store.componentsState.components}
                    renderItem={item => (
                        <List.Item key={item.id}>
                            <List.Item.Meta
                                title={item.name}
                                description={this.substrItem(item.desc)}
                            >
                            </List.Item.Meta>
                        </List.Item>
                    )}
                >
                    {this.props.store.componentsLoading() && (
                        <div className="loading-container">
                            <Spin />
                        </div>
                    )}
                </List>
            </InfiniteScroll >
        );
    }

    render() {
        return (
            <Row >
                <Col span={6}>
                </Col>
                <Col span={12}>
                    <Select />
                    <Divider plain>{<Statistic title="Components" value={this.props.store.componentsState.total} />}</Divider>
                    {/* components list */}
                    {this.renderComponentsList()}
                </Col>
                <Col span={6}>
                    <BackTop />
                </Col>
            </Row>
        );
    }
}


export default Components;