"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_dnd_1 = require("react-dnd");
const react_dnd_html5_backend_1 = require("react-dnd-html5-backend");
const react_dom_1 = require("react-dom");
const PropTypes = require("prop-types");
a1();
function a1() {
    const ItemTypes = {
        BOX: 'box',
    };
    class DustbinSingleTargetIframe extends React.Component {
        render() {
            return (React.createElement("div", null,
                React.createElement(Container, null)));
        }
    }
    let Container = class Container extends React.Component {
        render() {
            return React.createElement(react_dnd_1.DragDropContextProvider, { backend: react_dnd_html5_backend_1.default },
                React.createElement("div", null,
                    React.createElement("div", { style: { overflow: 'hidden', clear: 'both' } },
                        React.createElement(Dustbin, null)),
                    React.createElement("div", { style: { overflow: 'hidden', clear: 'both' } },
                        React.createElement(Box, { name: "Glass" }),
                        React.createElement(Box, { name: "Banana" }),
                        React.createElement(Box, { name: "Paper" }))));
        }
    };
    Container = __decorate([
        react_dnd_1.DragDropContext(react_dnd_html5_backend_1.default)
    ], Container);
    const style = {
        border: '1px dashed gray',
        backgroundColor: 'white',
        padding: '0.5rem 1rem',
        marginRight: '1.5rem',
        marginBottom: '1.5rem',
        cursor: 'move',
        float: 'left',
    };
    const boxSource = {
        beginDrag(props) {
            return {
                name: props.name,
            };
        },
        endDrag(props, monitor) {
            const item = monitor.getItem();
            const dropResult = monitor.getDropResult();
            if (dropResult) {
                window.alert(`You dropped ${item.name} into ${dropResult.name}!`);
            }
        },
    };
    let Box = class Box extends React.Component {
        render() {
            const { isDragging, connectDragSource } = this.props;
            const { name } = this.props;
            const opacity = isDragging ? 0.4 : 1;
            return (connectDragSource(React.createElement("div", { style: Object.assign({}, style, { opacity }) }, name)));
        }
    };
    Box.propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired,
        name: PropTypes.string.isRequired,
    };
    Box = __decorate([
        react_dnd_1.DragSource(ItemTypes.BOX, boxSource, (connect, monitor) => ({ connectDragSource: connect.dragSource(), isDragging: monitor.isDragging() }))
    ], Box);
    const style2 = {
        height: '12rem',
        width: '12rem',
        marginRight: '1.5rem',
        marginBottom: '1.5rem',
        color: 'white',
        padding: '1rem',
        textAlign: 'center',
        fontSize: '1rem',
        lineHeight: 'normal',
        float: 'left',
    };
    const boxTarget = {
        drop(props, monitor, component) {
            component.setState({
                myname: 'Dustbin'
            });
            return { name: 'Dustbin' };
        },
    };
    let Dustbin = class Dustbin extends React.Component {
        constructor() {
            super();
            this.state = { myname: 'Jerry' };
        }
        render() {
            const { canDrop, isOver, connectDropTarget } = this.props;
            const isActive = canDrop && isOver;
            console.log(isActive);
            let backgroundColor = '#222';
            if (isActive) {
                backgroundColor = 'darkgreen';
            }
            else if (canDrop) {
                backgroundColor = 'darkkhaki';
            }
            return connectDropTarget(React.createElement("div", { style: Object.assign({}, style2, { backgroundColor }) },
                isActive ?
                    'Release to drop' :
                    'Drag a box here',
                React.createElement("label", null, this.state.myname)));
        }
    };
    Dustbin.propTypes = {
        connectDropTarget: PropTypes.func.isRequired,
        isOver: PropTypes.bool.isRequired,
        canDrop: PropTypes.bool.isRequired,
    };
    Dustbin = __decorate([
        react_dnd_1.DropTarget(ItemTypes.BOX, boxTarget, (connect, monitor) => ({ connectDropTarget: connect.dropTarget(), isOver: monitor.isOver(), canDrop: monitor.canDrop(), })),
        __metadata("design:paramtypes", [])
    ], Dustbin);
    var dom = document.getElementById('page_content');
    react_dom_1.render(React.createElement(DustbinSingleTargetIframe, null), dom);
}
