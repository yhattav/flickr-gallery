// import 'jsdom-global/register';
import React from 'react';
import {mount, shallow} from 'enzyme';
//import moxios from 'moxios';
//import sinon from 'sinon';
import {expect} from 'chai';
import Slideshow from './Slideshow.js';

describe('Slideshow', () => {

  const sampleSizes = [
    {label: 'Square', width:75, height: 75, source: 'http://farm2.staticflickr.com/1103/567229075_2cf8456f01_s.jpg', url: 'http://www.flickr.com/photos/stewart/567229075/sizes/sq/', media: 'photo'},
    {label:'Medium', width:500, height:375, source: 'http://farm2.staticflickr.com/1103/567229075_2cf8456f01.jpg', url: 'http://www.flickr.com/photos/stewart/567229075/sizes/m/', media:'photo'},
    {label:'Large', width:1024, height:768, source: 'http://farm2.staticflickr.com/1103/567229075_2cf8456f01_b.jpg', url: 'http://www.flickr.com/photos/stewart/567229075/sizes/l/', media:'photo'}
  ];

  const sampleImage = {id: '567229075', owner: '59717246@N05', secret: '2cf8456f01', server: '1103', farm: 2};

   let wrapperSlide;
   const galleryWidth = 1000;
   const galleryHeight = 1080;

   const mountSlideshow = () => {
     return shallow(
       <Slideshow dto={sampleImage} large={true} galleryWidth={galleryWidth} galleryHeight={galleryHeight} imageIndexInImages={3}/>,
       {lifecycleExperimental: true, attachTo: document.createElement('div')}
     );
   };
   const mountFirstSlideshow = () => {
     return shallow(
       <Slideshow dto={sampleImage} large={true} galleryWidth={galleryWidth} galleryHeight={galleryHeight} imageIndexInImages={0}/>,
       {lifecycleExperimental: true, attachTo: document.createElement('div')}
     );
   };
  //  beforeEach(() => {
  //    wrapper = mountSlideshow();
  //  });
   beforeEach(() => {
    wrapperSlide = mount(
      <Slideshow dto={sampleImage} large={true} galleryWidth={galleryWidth} galleryHeight={galleryHeight} imageIndexInImages={3}/>,
      {attachTo: document.createElement('div')}
    );
  });
    it('renders', () => {
    expect(wrapperSlide).to.not.be.undefined;
  });

  it('finds the large size url for a picture', () => {
    wrapperSlide = mountSlideshow();
    wrapperSlide.state().sizes = sampleSizes;
    var url = wrapperSlide.instance().urlFromSizes();
    expect(url).to.eq('http://farm2.staticflickr.com/1103/567229075_2cf8456f01_b.jpg');
  });

  it('keeps the aspect ratio of images like in the original(largest) even when the window ratio is different', () => {
    wrapperSlide = mountSlideshow();
    wrapperSlide.state().sizes = sampleSizes;
    //var url = wrapperSlide.instance().urlFromSizes();
    wrapperSlide.instance().calcSlideSize(sampleSizes);
    expect(768 / 1024).to.eq(wrapperSlide.state().slideHeight / wrapperSlide.state().slideWidth);
  });

  it('render 3 icons on Slideshow', () => {
    wrapperSlide = mountSlideshow();
    expect(wrapperSlide.find('.image-icon').length).to.equal(3);
  });

    it('render only 2 icons on first Slideshow', () => {
    wrapperSlide = mountFirstSlideshow();
    expect(wrapperSlide.find('.image-icon').length).to.equal(2);
  });
// it('gets sizes for the image', done => {// why does it say undefined to equal 'test4'? test4 is in the app.js test ...cant find explanation
//     // moxios.install();
//     // moxios.wait(() => {
//     //   const request = moxios.requests.mostRecent();
//     //   request.respondWith({
//     //     status: 200,
//     //     response: {
//     //       sizes: {
//     //         size: sampleSizes
//     //       }
//     //     }
//     //   }).then(() => {
//     //     //console.log(sampleSizes.length)
//     //     //expect(wrapperSlide.state().sizes.length);
//     //     //done();
//     //     moxios.uninstall();
//     //   });
//     // });
//     // wrapperSlide = mount(
//     //   <Slideshow dto={sampleImage} large={false} galleryWidth={galleryWidth} galleryHeight={galleryHeight}/>,
//     //   {attachTo: document.createElement('div')}
//     // );
//   });
  // it('render 3 icons on each image', () => {
  //   expect(wrapper.find('FontAwesome').length).to.equal(3);
  // });

  // it('calc image size on mount', () => {
  //   const spy = sinon.spy(Image.prototype, 'calcImageSize');
  //   wrapper = mountImage();
  //   expect(spy.called).to.be.true;
  // });

  // it('calculate image size correctly', () => {
  //   const imageSize = wrapper.state().size;
  //   const remainder = galleryWidth % imageSize;
  //   expect(remainder).to.be.lessThan(1);
  // });

});
