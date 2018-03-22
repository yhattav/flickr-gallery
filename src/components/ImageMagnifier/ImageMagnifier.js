
import ReactDOM from 'react-dom';
import React from 'react';
import PropTypes from 'prop-types';
import './ImageMagnifier.scss';

class Magnifier extends React.Component {

    static propTypes = {
        size: PropTypes.number.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        offsetX: PropTypes.number.isRequired,
        offsetY: PropTypes.number.isRequired,
        cursorOffset: PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired
        }).isRequired,
        smallImage: PropTypes.shape({
            src: PropTypes.string.isRequired,
            width: PropTypes.number.isRequired,
            height: PropTypes.number.isRequired
        }).isRequired,
        zoomImage: PropTypes.shape({
            src: PropTypes.string.isRequired,
            width: PropTypes.number.isRequired,
            height: PropTypes.number.isRequired
        }).isRequired
    }

    render () {
        var props = this.props;
        var halfSize = props.size / 2;
        var magX = props.zoomImage.width / props.smallImage.width;
        var magY = props.zoomImage.height / props.smallImage.height;
        var bgX = -(props.offsetX*magX - halfSize);
        var bgY = -(props.offsetY*magY- halfSize);
        var isVisible = props.offsetY < props.smallImage.height &&
                        props.offsetX < props.smallImage.width &&
                        props.offsetY > 0 &&
                        props.offsetX > 0 &&
                         magX > 1;
        var lensX =(1-(props.offsetX / (props.smallImage.width*0.5)))*(  props.cursorOffset.x);
        var lensY =(1-(props.offsetY / (props.smallImage.height*0.5)))*( props.cursorOffset.y);
        return (
            <div style={{
                position: 'absolute',
                display: isVisible ? 'block' : 'none',
                top: props.y,
                left: props.x,
                width: props.size,
                height: props.size,
                marginLeft: `${-halfSize + lensX}px`,
                marginTop: `${ -halfSize + lensY}px`,
                backgroundColor: 'white',
                borderRadius: props.size,
                boxShadow: '`1px 1px 6px rgba(0,0,0,0.3)`',
                zIndex: 3000
            }}>
                <div style={{
                    width: props.size,
                    height: props.size,

                    backgroundImage: `url(${props.zoomImage.src})`,
                    backgroundColor: 'white',
                    backgroundSize: `${props.zoomImage.width}px ${props.zoomImage.height}px`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: `${bgX}px ${bgY}px`,
                    borderRadius: props.size
                }} />
            </div>
        );
    }
}

function getOffset(el) {
    var x = 0;
    var y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        x += el.offsetLeft - el.scrollLeft;
        y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { x, y };
}




class ImageMagnifier extends React.Component {

    static propTypes = {
        size: PropTypes.number,
        cursorOffset: PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired
        }),
        image: PropTypes.shape({
            src: PropTypes.string.isRequired,
            width: PropTypes.number.isRequired,
            height: PropTypes.number.isRequired
        }).isRequired,
        zoomImage: PropTypes.shape({
            src: PropTypes.string.isRequired,
            width: PropTypes.number.isRequired,
            height: PropTypes.number.isRequired
        }).isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            x: 0,
            y: 0,
            offsetX: -1,
            offsetY: -1,
            portalElement: null
        };
        this.onMouseMove = this.onMouseMove.bind(this);
      }

    componentDidMount() {
        document.addEventListener('mousemove', this.onMouseMove);
        if (!this.portalElement) {
            this.portalElement = document.createElement('div');
            document.body.appendChild(this.portalElement);
        }
        this.componentDidUpdate();
    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.body.removeChild(this.portalElement);
        this.portalElement = null;
    }

    onMouseMove (e) {
        var offset = getOffset(ReactDOM.findDOMNode(this));
        this.setState({
            x: e.x + window.scrollX,
            y: e.y + window.scrollY,
            offsetX: e.x - offset.x,
            offsetY: e.y - offset.y
        });
    }

    componentDidUpdate() {
        ReactDOM.render(<Magnifier
            size={this.props.size}
            smallImage={this.props.image}
            zoomImage={this.props.zoomImage}
            cursorOffset={this.props.cursorOffset}
            {...this.state}
        />, this.portalElement);
    }

    render () {
        return (
            <img
             style={{
                    width: this.props.image.width + 'px',
                    height: this.props.image.height + 'px'
                  }}
             src={this.props.image.src} />
        );
    }
}

ImageMagnifier.defaultProps = {
    size: 200,
    cursorOffset: { x: 0, y: 0 }
  };

  export default ImageMagnifier

  // used react-image-magnifier as a base to this