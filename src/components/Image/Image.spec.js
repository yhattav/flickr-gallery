import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import {expect} from 'chai';
import Image from './Image.js';
import TestUtils from 'react-dom/test-utils';

 describe('Image', () => {
   const OriginalImage = Image.DecoratedComponent;
   const identity = el => el;
   const sampleImage = {id: '28420720169', owner: '59717246@N05', secret: 'd460443ecb', server: '4722', farm: 5};
   let wrapper;
   const galleryWidth = 1111;
   const mountImage = () => {
     return shallow(
       <OriginalImage name='test'
          dto={sampleImage}
          id='0'
          index= {0}
          galleryWidth={galleryWidth}
          deleteClick={(() => {})}
          largeClick={(() => {})}
          connectDropTarget={identity}
          connectDragSource={identity} />,
       {lifecycleExperimental: true, attachTo: document.createElement('div')}
     );
   };

   beforeEach(() => {
     wrapper = mountImage();
   });

   it('render 3 icons on each image', () => {
     expect(wrapper.find('FontAwesome').length).to.equal(3);
   });

   it('has 1 opacity while not dragged', () => {
    expect(wrapper.find('.image-root').prop('style')).to.deep.include({ opacity: 1})
    //expect(div.props.style.opacity).to.eq(1);
  //   // Obtain the reference to the component before React DnD wrapping
  //   const OriginalImage = Image.DecoratedComponent;
  
  //   // Stub the React DnD connector functions with an identity function
  //   const identity = el => el;
  
  //   // Render with one set of props and test
  //   let root = TestUtils.renderIntoDocument(
  //     <OriginalImage name='test'
  //         dto={sampleImage}
  //         id='0'
  //         index= {0}
  //         galleryWidth={galleryWidth}
  //         deleteClick={(() => {})}
  //         largeClick={(() => {})}
  //         connectDropTarget={identity}
  //         connectDragSource={identity} />
  //   );
  //   let div = TestUtils.findRenderedDOMComponentWithClass(root, 'image-root');
  //   console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' +div.props.style.opacity);
  //   expect(div.props.style.opacity).toEqual(1);
  
  //   // Render with another set of props and test
  //   root = TestUtils.renderIntoDocument(
  //     <OriginalImage name='test'
  //                   dto={sampleImage}
  //                   id='0'
  //                   index= {0}
  //                   galleryWidth={galleryWidth}
  //                   deleteClick={(() => {})}
  //                   largeClick={(() => {})}
  //                   connectDropTarget={identity}
  //                  connectDragSource={identity}
  //                  isDragging />
  //   );
  //   div = TestUtils.findRenderedDOMComponentWithClass(root, 'image-root');
  //   expect(div.props.style.opacity).toEqual(0);
   });

  it('rotates in 90 deg', () => {
     const rotate = 90;
     wrapper.instance().rotate_Click();
     expect(wrapper.state().rotate).to.eq(rotate);
   });

// not sure how to check for functions that are in the props.
  // it("simulates click event for enlarge", function() {
  //   const spy = sinon.spy(Image.prototype, 'largeClick');
  //   wrapper.find(".expandButton").simulate('click');
  //   expect(spy.called).to.be.true;
  //   spy.restore();
  // });

  //  it("simulates click event for delete", function() {
  //    const spy = sinon.spy(Gallery.prototype, 'delete_Click');
  //    wrapper.instance().deleteClick();
  //    wrapper.find(".deleteButton").simulate('click');
  //    expect(spy.called).to.be.true;
  //    spy.restore();
  //  });

     it('simulates click event for rotation', function() {
     const spy = sinon.spy(OriginalImage.prototype, 'rotate_Click');
     wrapper.find('.rotateButton').simulate('click');
     expect(spy.called).to.be.true;
     spy.restore();
     });
 });