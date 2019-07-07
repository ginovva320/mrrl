import React from 'react';
import './App.css';
import {Cost, getCosts, inventory, Quality} from "./calc";
import {Avatar, Col, Form, InputNumber, List, Row} from "antd";

const App: React.FC = () => {
    const [toBuy, setToBuy] = React.useState<Cost>({});

    const formItemLayout = {
        labelCol: {span: 8},
        wrapperCol: {span: 16},
    };

    const costs = getCosts(toBuy);

    const goldCost = costs.reduce((g, cost) => {
        if (cost.quality === Quality.COMMON) {
            return g + cost.quantity;
        } else {
            return g;
        }
    }, 0);

    return (
        <div className="App">
            <Row gutter={16}>
                <Col span={12}>
                    <h1>Mrrl Calculator</h1>
                    <p>
                        Enter the cost of the item you want to buy below. Then follow the steps on the right.
                    </p>
                    <Form {...formItemLayout}>
                        {inventory.sort((b, a) => a.quality - b.quality).map((item, i) => (
                            <Form.Item className={`rarity-${item.quality.toString()}`} label={item.name} key={i}>
                                <InputNumber value={toBuy[item.name] || 0} min={0}
                                             onChange={value => setToBuy({...toBuy, [item.name]: value})}
                                />
                            </Form.Item>
                        ))}
                    </Form>
                </Col>
                <Col span={12}>
                    <h4>Gold Cost: {goldCost}g</h4>
                    <List
                        itemLayout="horizontal"
                        dataSource={costs}
                        renderItem={step => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar
                                        src="https://orig00.deviantart.net/26a3/f/2015/021/d/5/murloc_avatar__12_by_colare-d8etv4m.png"/>}
                                    title={step.vendor}
                                    description={`Buy ${step.quantity}x ${step.item}`}
                                />
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default App;
