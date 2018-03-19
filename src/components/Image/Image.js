import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number,
    size: PropTypes.number,
    imageIndexInImages: PropTypes.number,
    imageIndex: PropTypes.string
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
          <FontAwesome className="image-icon deleteButton" id="deleteButton" name="trash-alt" title="delete" onClick={() => this.props.deleteClick(this.props.imageIndex)}/>
          <FontAwesome className="image-icon expandButton" id="expandButton" name="expand" title="expand" onClick={() => this.props.largeClick(this.props.imageIndex)}/>
        </div>
      </div>
    );
  }
  
}

export default Image;