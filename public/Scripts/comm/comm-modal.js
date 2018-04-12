"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Modal = require("react-modal");
const react_draggable_1 = require("react-draggable");
class ModalCom extends React.Component {
    constructor() {
        super();
    }
    render() {
        let { isOpen, className, overlayClassName, isDraggable, onAfterOpen, onRequestClose } = this.props;
        let children_count = React.Children.count(this.props.children);
        return React.createElement(Modal, { isOpen: isOpen, className: className, overlayClassName: overlayClassName, onAfterOpen: onAfterOpen, onRequestClose: onRequestClose }, children_count > 1 ? this.props.children :
            React.createElement(react_draggable_1.default, { disabled: !isDraggable }, this.props.children));
    }
}
ModalCom.defaultProps = {
    isOpen: false,
    contentLabel: 'Modal',
    className: '',
    overlayClassName: '',
    isDraggable: false,
    isLock: true
};
exports.default = ModalCom;
