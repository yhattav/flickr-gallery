import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';
import { DragSource, DropTarget } from 'react-dnd'
import ItemTypes from '../ItemTypes'
import { findDOMNode } from 'react-dom'

const imageSource = {
	beginDrag(props) {
		return {
			id: props.id,
			index: props.index
		}
	}
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
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Get horizontal middle
    const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Get pixels to the left
    const hoverClientX = clientOffset.x - hoverBoundingRect.left;

    const upwards = dragIndex > hoverIndex && hoverClientY > hoverMiddleY;
    const downwards = dragIndex < hoverIndex && hoverClientY < hoverMiddleY;
    const leftwards = dragIndex > hoverIndex && hoverClientX > hoverMiddleX;
    const rightwards = dragIndex < hoverIndex && hoverClientX < hoverMiddleX;

    if (upwards && (leftwards || rightwards)){
      return;
    }

    if (downwards && (leftwards || rightwards)){
      return;
    }


		// Time to actually perform the action
		props.moveImage(dragIndex, hoverIndex)

		// Note: we're mutating the monitor item here!
		// Generally it's better to avoid mutations,
		// but it's good here for the sake of performance
		// to avoid expensive index searches.
		monitor.getItem().index = hoverIndex
	}
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




class Image extends React.Component {

  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
		connectDropTarget: PropTypes.func.isRequired,
		index: PropTypes.number.isRequired,
		isDragging: PropTypes.bool.isRequired,
		id: PropTypes.any.isRequired,
		moveImage: PropTypes.func.isRequired,
    dto: PropTypes.object,
    galleryWidth: PropTypes.number,
    size: PropTypes.number
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
    const {
			isDragging,
			connectDragSource,
			connectDropTarget
		} = this.props;
    const opacity = isDragging ? 0 : 1
    const backgroundImage = `url(${this.urlFromDto(this.props.dto)})`;
    const width = `${this.props.size}px`;
    const height = `${this.props.size}px`;
    const transform = `rotate(${this.state.rotate}deg)`;
  
    return connectDragSource(
			connectDropTarget(<div
        className="image-root"
        style={{ opacity, backgroundImage, width, height, transform }}
        >
        <div
        style={{
          transform: 'rotate(-'+this.state.rotate + 'deg)'
        }}>
          <FontAwesome className="image-icon rotateButton" id="rotateButton" name="sync-alt" title="rotate" onClick={() => this.rotate_Click()}/>
          <FontAwesome className="image-icon deleteButton" id="deleteButton" name="trash-alt" title="delete" onClick={() => this.props.deleteClick(this.props.id)}/>
          <FontAwesome className="image-icon expandButton" id="expandButton" name="expand" title="expand" onClick={() => this.props.largeClick(this.props.id)}/>
        </div>
      </div>),
		)
  }
  
}

const dropTargetHOC = DropTarget(ItemTypes.IMAGE, imageTarget, collectDrop)
const dragSourceHOC = DragSource(ItemTypes.IMAGE, imageSource, collectDrag)

export default dropTargetHOC(dragSourceHOC(Image))


// used react-dnd
// https://github.com/react-dnd/react-dnd/blob/master/examples/04%20Sortable/Simple/Card.js#L92
// https://github.com/react-dnd/react-dnd/issues/157