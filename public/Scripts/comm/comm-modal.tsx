import * as React from 'react';
import { render } from 'react-dom';
import * as Modal from 'react-modal';
import Draggable from 'react-draggable';

interface ModalComProps {
    isOpen: boolean
    className?: string
    overlayClassName?: string
    contentLabel?: string
    isDraggable?: boolean //是否可拖曳
    isLock?: boolean //是否背景鎖定

    onAfterOpen?: Function
    onRequestClose?: Function
}

export default class ModalCom extends React.Component<ModalComProps, any>{

    constructor() {
        super();
    }
    static defaultProps = {
        isOpen: false,
        contentLabel: 'Modal',
        className: '',
        overlayClassName: '',
        isDraggable: false,
        isLock: true
    }
    render() {
        let { isOpen, className, overlayClassName, isDraggable, onAfterOpen, onRequestClose } = this.props;
        let children_count = React.Children.count(this.props.children);
        return <Modal
            isOpen={isOpen}
            className={className}
            overlayClassName={overlayClassName}
            onAfterOpen={onAfterOpen}
            onRequestClose={onRequestClose}>

            {children_count > 1 ? this.props.children : //Draggable下只能有一個children 有2個及以上是無法使用Draggable
                <Draggable disabled={!isDraggable}>
                    {this.props.children}
                </Draggable>}
        </Modal>;
    }
}