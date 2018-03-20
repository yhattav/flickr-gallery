import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';
import { DragSource, DropTarget } from 'react-dnd'
import ItemTypes from '../ItemTypes'
import { findDOMNode } from 'react-dom'
//var flow = require('lodash/function/flow');
//import {flow} from 'lodash/function/flow'

const imageSource = {
	beginDrag(props) {
		return {
			id: props.id,
			index: props.index,
		}
	},
}

const imageTarget = {
	hover(props, monitor, component) {
		const dragIndex = monitor.getItem().index
		const hoverIndex = props.index

		// Don't replace items with themselves
		if (dragIndex === hoverIndex) {
			return
		}

		// Determine rectangle on screen
		const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()

		// Get vertical middle
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

		// Determine mouse position
		const clientOffset = monitor.getClientOffset()

		// Get pixels to the top
		const hoverClientY = clientOffset.y - hoverBoundingRect.top

		// Only perform the move when the mouse has crossed half of the items height
		// When dragging downwards, only move when the cursor is below 50%
		// When dragging upwards, only move when the cursor is above 50%

		// Dragging downwards
		if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
			return
		}

		// Dragging upwards
		if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
			return
		}

		// Time to actually perform the action
		props.moveCard(dragIndex, hoverIndex)

		// Note: we're mutating the monitor item here!
		// Generally it's better to avoid mutations,
		// but it's good here for the sake of performance
		// to avoid expensive index searches.
		monitor.getItem().index = hoverIndex
	},
}


function collectDrop(connect) {
  return {
    connectDropTarget: connect.dropTarget()
  }
}

function collectDrag(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

// @DropTarget(ItemTypes.CARD, cardTarget, connect => ({
// 	connectDropTarget: connect.dropTarget(),
// }))

// @DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
// 	connectDragSource: connect.dragSource(),
// 	isDragging: monitor.isDragging(),
// }))



class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number,
    size: PropTypes.number,
    index: PropTypes.number,
    id: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      rotate: 0,
      isLarge: false
    };
  }


  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  rotate_Click ()  {
    var rotateEdit = this.state.rotate;
    rotateEdit = rotateEdit + 90;
        this.setState({
      rotate: rotateEdit
    });
   }

  render() {
    return (
      <div
        className="image-root"
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.props.size + 'px',
          height: this.props.size + 'px',
          transform: 'rotate('+this.state.rotate + 'deg)'
          
          
        }}
        >
        <div
        style={{
          transform: 'rotate(-'+this.state.rotate + 'deg)'
        }}>
          <FontAwesome className="image-icon rotateButton" id="rotateButton" name="sync-alt" title="rotate" onClick={() => this.rotate_Click()}/>
          <FontAwesome className="image-icon deleteButton" id="deleteButton" name="trash-alt" title="delete" onClick={() => this.props.deleteClick(this.props.id)}/>
          <FontAwesome className="image-icon expandButton" id="expandButton" name="expand" title="expand" onClick={() => this.props.largeClick(this.props.id)}/>
        </div>
      </div>
    );
  }
  
}

const dropTargetHOC = DropTarget(ItemTypes.IMAGE, imageTarget, collectDrop)
const dragSourceHOC = DragSource(ItemTypes.IMAGE, imageSource, collectDrag)

export default dropTargetHOC(dragSourceHOC(Image))




//  module.exports = flow(
//    DragSource('image', imageSource, collect),
//    DropTarget('image', imageTarget, collectTarget)
//   )(Image);

//  module.exports = DragSource(ItemTypes.KNIGHT, knightSource, collect)(Knight);
//  export default DragSource(ItemTypes.IMAGE, imageSource, collect)(Knight);

//export default Image;
//  export const Image = DragSourceItemTypes.CARD, cardSource, (connect, monitor) => ({
// 	connectDragSource: connect.dragSource(),
// 	isDragging: monitor.isDragging(),
// }))(Image);
// // ^^^ export the intermediate component

// export default const MyComponentDropTarget = DropTarget(/* ... */)(MyComponentDragSource);
// https://github.com/react-dnd/react-dnd/blob/master/examples/04%20Sortable/Simple/Card.js#L92
// https://github.com/react-dnd/react-dnd/issues/157