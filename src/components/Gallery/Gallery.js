import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import Slideshow from '../Slideshow';
import Backtop from '../Backtop';
import './Gallery.scss';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props){
    super(props);
    this.state = {
      images: [],
      galleryHeight: this.getGalleryHeight(),
      galleryWidth: this.getGalleryWidth(),
      currentPage: 1,
      isScrollDisabled: false
    };
    this.delete_Click = this.delete_Click.bind(this);
    this.large_Click = this.large_Click.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.arrow_Click = this.arrow_Click.bind(this);
  }

  calcImageSize() {
    const galleryWidth = this.getGalleryWidth();
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const imageSize = (galleryWidth / imagesPerRow );
    this.setState({
      imageSize
    });
  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  getGalleryHeight(){
    try {
      return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    } catch (e) {
      return 5000;
    }
  }

  delete_Click(id) {
    var tempimages = this.state.images;
    var removeIndex = tempimages.map(function(e) { return e.id; }).indexOf(id);
    tempimages.splice(removeIndex, 1);
    this.setState({images: tempimages});
    
   }

   large_Click(id) {
    var tempimages = this.state.images;
    var largeIndex = tempimages.map(function(e) { return e.id; }).indexOf(id);
    tempimages[largeIndex].large = !tempimages[largeIndex].large;
    this.setState({images: tempimages});
    
    document.body.style.overflow=(this.isScrollDisabled ? 'auto':'hidden');
    this.isScrollDisabled = !this.isScrollDisabled;
   }

arrow_Click(id,direction) {
  var tempimages = this.state.images;
  var largeIndex = tempimages.map(function(e) { return e.id; }).indexOf(id);
  var newIndex = largeIndex+direction;
  tempimages[largeIndex].large = !tempimages[largeIndex].large;
  tempimages[newIndex].large = !tempimages[newIndex].large;
  this.getCloseToEnd(newIndex,tempimages.length)
  this.setState({images: tempimages});

}

getCloseToEnd(index,len) {
   var len = this.state.images.length;
   if ((len-index)<3) {
     this.getImages(this.props.tag,this.state.currentPage);
    }
}


   handleScroll() {
     const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
     const body = document.body;
     const html = document.documentElement;
     const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
     const windowBottom = windowHeight + window.pageYOffset;
     if (windowBottom >= docHeight) {
       this.getImages(this.props.tag,this.state.currentPage);
     }

  }

handleResize() {
  var galleryWidth = this.getGalleryWidth();
  var galleryHeight = this.getGalleryHeight();
  this.setState({
    galleryWidth: galleryWidth,
    galleryHeight: galleryHeight
  });
  this.calcImageSize();
}

  getImages(tag,page) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=100&page=${page}&format=json&nojsoncallback=1`;
    const baseUrl = 'https://api.flickr.com/';
    axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: 'GET'
    })
      .then(res => res.data)
      .then(res => {
        if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0
        ) {
                    
          var images = this.state.images.slice();
          images = images.concat(res.photos.photo);
          this.setState({
             images: images
             });
        }
      });
    var newCurrentPage = this.state.currentPage;
    newCurrentPage = newCurrentPage + 1;
    this.setState({
      currentPage: newCurrentPage
    });

  }

  componentDidMount() {
    this.getImages(this.props.tag,this.state.currentPage);
    this.setState({
      galleryWidth: this.getGalleryWidth(),
      getGalleryHeight: this.getGalleryHeight()
    });
    this.calcImageSize();
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
  }
  componentWillReceiveProps(props) {
    this.setState({
      images: [],
      currentPage: 1
    })
    this.getImages(props.tag,0);
  }

  render() {
    return (
      <div className="gallery-root"
      style={{
          width: this.galleryWidth + 'px'
        }}
      >
        {this.state.images.map((dto,index) => {
        if(dto.large)
         return <Slideshow
          imageIndexInImages={index}
          galleryLength={this.state.images.length}
          imageIndex={dto.id}
          large={dto.large}
          arrowClick={this.arrow_Click}
          largeClick={this.large_Click}
          deleteClick={this.delete_Click}
          key={'slideshow-' + dto.id}
          dto={dto}
          size={this.state.galleryWidth/2}
          galleryWidth={this.state.galleryWidth}
          galleryHeight={this.state.galleryHeight}/>;
          })}
        {this.state.images.map((dto,index) => {
          return <Image imageIndexInImages={index} imageIndex={dto.id} large={dto.large} largeClick={this.large_Click} deleteClick={this.delete_Click} key={'image-' + dto.id} dto={dto} size={this.state.imageSize} galleryWidth={this.state.galleryWidth}/>;
          
        })}
         <Backtop key='Backtop'/>
      </div>
    );
  }
}

export default Gallery;