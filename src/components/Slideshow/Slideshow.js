import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import FontAwesome from 'react-fontawesome';
import './Slideshow.scss';
import ImageMagnifier from '../ImageMagnifier';

class Slideshow extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number,
    galleryHeight: PropTypes.number,
    size: PropTypes.number,
    galleryLength: PropTypes.number,
    index: PropTypes.number,
    id: PropTypes.string,
    large: PropTypes.bool,
    size: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = {
      sizes: [
        {width: 1 , height: 1}
      ],
      rotate: 0,
      isLarge: false,
      slideWidth: 0,
      slideHeight: 0,
      imageWidth: 0,
      imageHeight: 0,
      imageSource: ''
    };
    this.calcSlideSize = this.calcSlideSize.bind(this);
  }


  urlFromSizes() {

    if (this.state.sizes[this.state.sizes.length-1].label==='Original') return this.state.sizes[this.state.sizes.length-2].source;
    else return this.state.sizes[this.state.sizes.length-1].source;

  }

  WidthFromSizes() {

    if (this.state.sizes[this.state.sizes.length-1].label==='Original') return this.state.sizes[this.state.sizes.length-2].width;
    else
    return this.state.sizes[this.state.sizes.length-1].width;

  }

  HeightFromSizes() {

    if (this.state.sizes[this.state.sizes.length-1].label==='Original') return this.state.sizes[this.state.sizes.length-2].height;
    else
    return this.state.sizes[this.state.sizes.length-1].height;

  }

  calcSlideSize(sizes){

    if (this.state.sizes[this.state.sizes.length-1].width == sizes[sizes.length-1].width) sizes = this.state.sizes;
    var galleryWidth = this.props.galleryWidth;
    var galleryHeight = this.props.galleryHeight;
    var imageWidth = sizes[sizes.length-1].width;
    var imageHeight = sizes[sizes.length-1].height;
    var imageRatio = imageHeight / imageWidth;
    var galleryRatio = galleryHeight / galleryWidth;
    if (imageRatio >= galleryRatio) {
    var slideWidth = galleryHeight / imageRatio *0.9;
    var slideHeight = galleryHeight*0.9;
    }
    else {
      var slideWidth = galleryWidth*0.9;
      var slideHeight = galleryWidth*imageRatio*0.9;
      }
      this.setState({
        slideWidth,
        slideHeight,
        imageWidth,
        imageHeight
      });
}

getSizes(dto) {
  const getSizesUrl = `services/rest/?method=flickr.photos.getSizes&api_key=522c1f9009ca3609bcbaf08545f067ad&photo_id=${dto.id}&format=json&nojsoncallback=1`;
  const baseUrl = 'https://api.flickr.com/';
  axios({
    url: getSizesUrl,
    baseURL: baseUrl,
    method: 'GET'
  })
      .then(res => res.data)
      .then(res => {
        if (
          res &&
          res.sizes &&
          res.sizes.size &&
          res.sizes.size.length > 0
        ) {
          var sizes = res.sizes.size;
          this.setState({
            sizes
          },
            this.calcSlideSize(sizes)
          );

        }
      });
      
}
  componentWillMount(){
    this.getSizes(this.props.dto);
  }

  componentWillReceiveProps() {
    this.calcSlideSize(this.state.sizes);
   
  }

render() {
  if (this.props.large){
    return (
      <div className="slideshow-root">
        <div className="slideshow-background">
              <div className="slide"
                style={{
                  backgroundImage: `url(${this.urlFromSizes()})`,
                  width: this.state.slideWidth + 'px',
                  height: this.state.slideHeight + 'px',
                  top: ((this.props.galleryHeight-this.state.slideHeight)/2)+ 'px',
                  left: ((this.props.galleryWidth-this.state.slideWidth)/2)+ 'px'
                }}
                >
                <ImageMagnifier
                image={{
                    src: `${this.urlFromSizes()}`,
                    width: Number.parseInt(this.state.slideWidth, 10),
                    height: Number.parseInt(this.state.slideHeight, 10)
                }}
                zoomImage={{
                    src: `${this.urlFromSizes()}`,
                    width: Number.parseInt(this.WidthFromSizes(), 10),
                    height: Number.parseInt(this.HeightFromSizes(), 10)
                }}
                cursorOffset={{ x: 120, y: 120 }}
            />
              </div>
        </div>
        <div className="icons-background">
              <div className="slide-icons">
                <FontAwesome className="image-icon" name="times" title="Close" onClick={() => this.props.largeClick(this.props.id)}/>
              </div>
              <div className="left-icons">
                {this.props.index > 0 &&
                <FontAwesome className="image-icon" name="chevron-left" title = {'Previous image: ' + (this.props.index-1) + '/' + this.props.galleryLength } onClick={() => this.props.arrowClick(this.props.id,-1)}/>}
              </div>
              <div className="right-icons">
                <FontAwesome className="image-icon" name="chevron-right" title={'Next Image: ' + (this.props.index+1) + '/' + this.props.galleryLength } onClick={() => this.props.arrowClick(this.props.id,1)}/>
              </div>
        </div>
      </div>
    );
  }
   else{
   return (
     <span/>
   );
 }
}
}
export default Slideshow;