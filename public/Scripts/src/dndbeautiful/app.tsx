import * as React from 'react';
import { DragSource, DropTarget, DragDropContext, DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { render } from 'react-dom';
import * as PropTypes from 'prop-types';
//import { DragDropContext, Droppable, Draggable, DragStart, DroppableProvided, DraggableLocation, DropResult, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';

import * as ReactDOM from 'react-dom';
import styled, { injectGlobal } from 'styled-components';

a1();
function a3() {
    class App extends React.Component<any, any> {
        constructor(props) {
            super(props);
            this._self = this;
            this.dragStart = this.dragStart.bind(this);
            this.state = {
            };
        }

        _self: any;

        dragStart(e) {
            console.log('dragStart', e);
            e.dataTransfer.setData("text", e.currentTarget.id);
        }

        drag(e) {
            //console.log('drag', e);
        }

        dragover(e) {
            e.preventDefault();
            console.log('dragover', e);
        }

        drop(e) {
            console.log('drop', e);
            e.preventDefault();
            var data = e.dataTransfer.getData("text");
        }

        render() {
            return (
                <div id="drag-drop-basic" style={{ background: '#eefeff', display: 'flex' }}>
                    <div id="source-container" style={{ flex: 1 }}>
                        <div id="drag-source"
                            draggable={true}
                            onDragStart={this.dragStart}
                            onDrag={this.drag}
                            style={{
                                width: '90px',
                                height: '90px',
                                borderRadius: '50%',
                                backgroundColor: 'steelblue'
                            }}
                        ></div>
                    </div>
                    <div id="target-container"
                        style={{
                            height: '90px', width: '90px',
                            background: '#ffeeee',
                            border: '2px solid #CCC',
                            flex: 1,
                            margin: '1rem'
                        }}
                        onDrop={this.drop}
                        onDragOver={this.dragover}
                    >
                        Here
                    </div>
                </div>
            );
        }
    }

    var dom = document.getElementById('page_content');
    render(<App />, dom);

}
//function a2() {
//    const getItems = count =>
//        Array.from({ length: count }, (v, k) => k).map(k => ({
//            id: `item-${k}`,
//            content: `Item ${k}`,
//        }));

//    // a little function to help us with reordering the result
//    const reorder = (list, startIndex, endIndex) => {
//        const result = Array.from(list);
//        const [removed] = result.splice(startIndex, 1);
//        result.splice(endIndex, 0, removed);

//        return result;
//    };

//    // using some little inline style helpers to make the app look okay
//    const grid = 8;
//    const getItemStyle = (draggableStyle, isDragging) => ({
//        // some basic styles to make the items look a bit nicer
//        userSelect: 'none',
//        padding: grid * 2,
//        marginBottom: grid,

//        // change background colour if dragging
//        background: isDragging ? 'lightgreen' : 'grey',

//        // styles we need to apply on draggables
//        ...draggableStyle,
//    });
//    const getListStyle = isDraggingOver => ({
//        background: isDraggingOver ? 'lightblue' : 'lightgrey',
//        padding: grid,
//        width: 250,
//    });

//    class App extends React.Component<any, any> {
//        constructor(props) {
//            super(props);
//            this.state = {
//                items: getItems(10),
//                lists: getItems(5)
//            };
//            this.onDragEnd = this.onDragEnd.bind(this);
//            this.onDragStart = this.onDragStart.bind(this);
//        }

//        onDragEnd(result) {
//            // dropped outside the list
//            if (!result.destination) {
//                return;
//            }

//            const items = reorder(
//                this.state.items,
//                result.source.index,
//                result.destination.index
//            );

//            this.setState({
//                items,
//            });
//        }

//        onDragStart(optional) {
//            //mlog('check 1', 'onDragStart', optional);
//        }

//        // Normally you would want to split things out into separate components.
//        // But in this example everything is just done in one place for simplicity
//        render() {
//            return (
//                <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
//                    <Droppable droppableId="droppable1">
//                        {
//                            (provided, snapshot) => (
//                                <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
//                                    {
//                                        this.state.items.map((item, i) => (
//                                            <Draggable key={item.id} draggableId={item.id}>
//                                                {(provided, snapshot) => (
//                                                    <div>
//                                                        <div
//                                                            ref={provided.innerRef}
//                                                            style={getItemStyle(provided.draggableStyle, snapshot.isDragging)}
//                                                            {...provided.dragHandleProps}>
//                                                            {item.content}
//                                                        </div>
//                                                        {provided.placeholder}
//                                                    </div>
//                                                )}
//                                            </Draggable>
//                                        ))
//                                    }
//                                    {provided.placeholder}
//                                </div>
//                            )}
//                    </Droppable>
//                </DragDropContext>
//            );
//        }
//    }

//    var dom = document.getElementById('page_content');
//    render(<App />, dom);
//}
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
