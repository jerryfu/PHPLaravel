import * as React from 'react';
import { DragSource, DropTarget, DragDropContext, DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { render } from 'react-dom';
import * as PropTypes from 'prop-types';

a1();
function a1() {
    const ItemTypes = {
        BOX: 'box',
    }
    class DustbinSingleTargetIframe extends React.Component<any, any> {
        render() {
            return (
                <div>
                    <Container />
                </div>
            );
        }
    }

    @DragDropContext(HTML5Backend)
    class Container extends React.Component<any, any> {
        render() {
            return <DragDropContextProvider backend={HTML5Backend}>
            <div>
                <div style={{ overflow: 'hidden', clear: 'both' }}>
                    <Dustbin />
                </div>
                <div style={{ overflow: 'hidden', clear: 'both' }}>
                    <Box name="Glass" />
                    <Box name="Banana" />
                    <Box name="Paper" />
                </div>
            </div>
            </DragDropContextProvider>;
        }
    }

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
                window.alert( // eslint-disable-line no-alert
                    `You dropped ${item.name} into ${dropResult.name}!`,
                );
            }
        },
    };

    @DragSource(ItemTypes.BOX, boxSource, (connect, monitor) => ({ connectDragSource: connect.dragSource(), isDragging: monitor.isDragging() }))
    class Box extends React.Component<any, any>  {
        static propTypes = {
            connectDragSource: PropTypes.func.isRequired,
            isDragging: PropTypes.bool.isRequired,
            name: PropTypes.string.isRequired,
        };

        render() {
            const { isDragging, connectDragSource } = this.props;
            const { name } = this.props;
            const opacity = isDragging ? 0.4 : 1;

            return (
                connectDragSource(
                    <div style={{ ...style, opacity }}>
                        {name}
                    </div>,
                )
            );
        }
    }


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
            })

            return { name: 'Dustbin' };
        },
    };

    @DropTarget(ItemTypes.BOX, boxTarget, (connect, monitor) => ({ connectDropTarget: connect.dropTarget(), isOver: monitor.isOver(), canDrop: monitor.canDrop(), }))
    class Dustbin extends React.Component<any, any> {
        static propTypes = {
            connectDropTarget: PropTypes.func.isRequired,
            isOver: PropTypes.bool.isRequired,
            canDrop: PropTypes.bool.isRequired,
        };
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
            } else if (canDrop) {
                backgroundColor = 'darkkhaki';
            }

            return connectDropTarget(
                <div style={{ ...style2, backgroundColor }}>
                    {isActive ?
                        'Release to drop' :
                        'Drag a box here'
                    }
                    <label>{this.state.myname}</label>
                </div>,
            );
        }
    }


    var dom = document.getElementById('page_content');
    render(<DustbinSingleTargetIframe />, dom);
}
