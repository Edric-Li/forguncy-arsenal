import React, {
  CSSProperties,
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Button, Modal, ModalProps } from 'antd';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import Draggable from 'react-draggable';

export interface DialogRef {
  resetPosition: () => void;
}

const titleStyle: CSSProperties = {
  userSelect: 'none',
  cursor: 'move',
};

const Dialog = forwardRef<DialogRef, ModalProps>(
  ({ title, children, className, footer, okButtonProps, ...otherProps }, ref) => {
    const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [disabled, setDisabled] = useState(true);
    const draggableRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      resetPosition: () => {
        setPosition({ x: 0, y: 0 });
      },
    }));

    useEffect(() => {
      if (otherProps.open) {
        document.querySelectorAll<HTMLInputElement>('.ant-modal input')[0]?.focus();
      }
    }, [otherProps.open]);

    const handleDragStart = (_event: DraggableEvent, uiData: DraggableData) => {
      const { clientWidth, clientHeight } = window.document.documentElement;
      const targetRect = draggableRef.current?.getBoundingClientRect();

      /**
       * Antd 官网也是坏的，在这里触发拖拽的时候判断一下，如果不是由Title触发的，就不让拖拽
       */
      if (_event.target !== titleRef.current) {
        setDisabled(true);
        return;
      }
      if (!targetRect) {
        return;
      }
      setBounds({
        left: -targetRect.left + uiData.x,
        right: clientWidth - (targetRect.right - uiData.x),
        top: -targetRect.top + uiData.y,
        bottom: clientHeight - (targetRect.bottom - uiData.y),
      });
    };

    const handleDragStop = (_event: DraggableEvent, uiData: DraggableData) => {
      setPosition({ x: uiData.x, y: uiData.y });
    };

    const titleRender = useMemo(() => {
      return (
        <div
          style={titleStyle}
          ref={titleRef}
          onMouseOver={() => setDisabled(false)}
          onMouseOut={() => setDisabled(true)}
        >
          <span>{title}</span>
        </div>
      );
    }, []);

    const renderDefaultFooter = () => {
      return (
        <>
          <Button
            {...okButtonProps}
            type='primary'
            htmlType='submit'
            loading={otherProps?.confirmLoading}
            onClick={otherProps.onOk as any}
          >
            确定
          </Button>
          <Button onClick={otherProps.onCancel as any}>取消</Button>
        </>
      );
    };

    return (
      <Modal
        centered
        maskClosable={false}
        destroyOnClose
        footer={footer !== undefined ? footer : renderDefaultFooter()}
        {...otherProps}
        title={titleRender}
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            position={position}
            onStop={handleDragStop}
            onStart={handleDragStart}
          >
            <div ref={draggableRef}>{modal}</div>
          </Draggable>
        )}
      >
        {children}
      </Modal>
    );
  },
);

export default memo(Dialog);
