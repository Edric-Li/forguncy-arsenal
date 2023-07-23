import {ColorPicker, Form, Input, InputNumber, Slider, Space, Watermark} from 'antd';
import type {Color} from 'antd/es/color-picker';
import React, {useMemo, useState} from 'react';

interface WatermarkConfig {
    content: string;
    color: string | Color;
    fontSize: number;
    zIndex: number;
    rotate: number;
    gap: [number, number];
    offset?: [number, number];
}

const WatermarkEditor: React.FC = () => {
    const [form] = Form.useForm();
    const [config, setConfig] = useState<WatermarkConfig>({
        content: '活字格666',
        color: 'rgba(0, 0, 0, 0.15)',
        fontSize: 16,
        zIndex: 11,
        rotate: -22,
        gap: [100, 100],
        offset: undefined,
    });
    const {content, color, fontSize, zIndex, rotate, gap, offset} = config;

    const watermarkProps = useMemo(
        () => ({
            content,
            font: {
                color: typeof color === 'string' ? color : color.toRgbString(),
                fontSize,
            },
            zIndex,
            rotate,
            gap,
            offset,
        }),
        [config],
    );

    return (
        <div style={{display: 'flex', padding: "1rem", width: "100%", height: "100%"}}>
            <Watermark {...watermarkProps}>
                <h2>企业级低代码开发平台，构建敏捷实践力</h2>
                六大引擎三大能力，驱动业务灵活、高效、安全落地，成为企业数字化转型的强力加速器
                <img
                    style={{
                        zIndex: 10,
                        width: '100%',
                        position: 'relative',
                    }}
                    src="./img.jpg"
                    alt="示例图片"
                />
            </Watermark>
            <Form
                style={{
                    width: 280,
                    flexShrink: 0,
                    borderLeft: '1px solid #eee',
                    paddingLeft: 20,
                    marginLeft: 20,
                }}
                form={form}
                layout="vertical"
                initialValues={config}
                onValuesChange={(_, values) => {
                    setConfig(values);
                }}
            >
                <Form.Item name="content" label="水印内容">
                    <Input placeholder="请输入"/>
                </Form.Item>
                <Form.Item name="color" label="文字颜色">
                    <ColorPicker/>
                </Form.Item>
                <Form.Item name="fontSize" label="文字大小">
                    <Slider step={1} min={0} max={100}/>
                </Form.Item>
                <Form.Item name="zIndex" label="层叠索引">
                    <Slider step={1} min={0} max={100}/>
                </Form.Item>
                <Form.Item name="rotate" label="旋转角度">
                    <Slider step={1} min={-180} max={180}/>
                </Form.Item>
                <Form.Item label="间距" style={{marginBottom: 0}}>
                    <Space style={{display: 'flex'}} align="baseline">
                        <Form.Item name={['gap', 0]}>
                            <InputNumber placeholder="gapX" style={{width: '100%'}}/>
                        </Form.Item>
                        <Form.Item name={['gap', 1]}>
                            <InputNumber placeholder="gapY" style={{width: '100%'}}/>
                        </Form.Item>
                    </Space>
                </Form.Item>
                <Form.Item label="偏移" style={{marginBottom: 0}}>
                    <Space style={{display: 'flex'}} align="baseline">
                        <Form.Item name={['offset', 0]}>
                            <InputNumber placeholder="offsetLeft" style={{width: '100%'}}/>
                        </Form.Item>
                        <Form.Item name={['offset', 1]}>
                            <InputNumber placeholder="offsetTop" style={{width: '100%'}}/>
                        </Form.Item>
                    </Space>
                </Form.Item>
            </Form>

        </div>
    );
};

export default WatermarkEditor;