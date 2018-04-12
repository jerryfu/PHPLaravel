"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const styled_components_1 = require("styled-components");
const constants_1 = require("./constants");
const react_beautiful_dnd_1 = require("react-beautiful-dnd");
const quote_list_1 = require("./primatives/quote-list");
const title_1 = require("./primatives/title");
const Wrapper = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
`;
const Container = styled_components_1.default.div `
  margin: ${constants_1.grid}px;
  display: flex;
  flex-direction: column;
`;
const Header = styled_components_1.default.div `
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: ${constants_1.borderRadius}px;
  border-top-right-radius: ${constants_1.borderRadius}px;
  background-color: ${({ isDragging }) => (isDragging ? constants_1.colors.blue.lighter : constants_1.colors.blue.light)};
  transition: background-color 0.1s ease;

  &:hover {
    background-color: ${constants_1.colors.blue.lighter};
  }
`;
class Column extends React.Component {
    render() {
        const title = this.props.title;
        const quotes = this.props.quotes;
        return (React.createElement(react_beautiful_dnd_1.Draggable, { draggableId: title, type: "COLUMN" }, (provided, snapshot) => (React.createElement(Wrapper, null,
            React.createElement(Container, { innerRef: provided.innerRef, style: provided.draggableStyle },
                React.createElement(Header, { isDragging: snapshot.isDragging },
                    React.createElement(title_1.default, Object.assign({ isDragging: snapshot.isDragging }, provided.dragHandleProps), title)),
                React.createElement(quote_list_1.default, { listId: title, listType: "QUOTE", quotes: quotes, autoFocusQuoteId: this.props.autoFocusQuoteId })),
            provided.placeholder))));
    }
}
exports.default = Column;
