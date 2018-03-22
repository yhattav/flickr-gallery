import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import {expect} from 'chai';
import Image from './Image.js';


 describe('Image', () => {
   const OriginalImage = Image.DecoratedComponent;
   const identity = el => el;
   const sampleImage = {id: '28420720169', owner: '59717246@N05', secret: 'd460443ecb', server: '4722', farm: 5};
   let wrapper;
   const galleryWidth = 1111;
   const largeClick = sinon.spy();
   const deleteClick = sinon.spy();
   const mountImage = () => {
     return shallow(
       <OriginalImage name='test'
          dto={sampleImage}
          id='0'
          index= {0}
          galleryWidth={galleryWidth}
          isDragging = {false}
          moveImage={(() => {})}
          deleteClick={deleteClick}
          largeClick={largeClick}
          connectDropTarget={identity}
          connectDragSource={identity} />,
       {lifecycleExperimental: true, attachTo: document.createElement('div')}
     );
   };
   const mountDraggedImage = () => {
    return shallow(
      <OriginalImage name='test'
         dto={sampleImage}
         id='0'
         index= {0}
         galleryWidth={galleryWidth}
         isDragging = {true}
         moveImage={(() => {})}
         deleteClick={deleteClick}
         largeClick={largeClick}
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
   });

   it('has 0 opacity while dragged', () => {
    wrapper.unmount();
    wrapper = mountDraggedImage();
    expect(wrapper.find('.image-root').prop('style')).to.deep.include({ opacity: 0})
   });

  it('rotates in 90 deg', () => {
     const rotate = 90;
     wrapper.instance().rotate_Click();
     expect(wrapper.state().rotate).to.eq(rotate);
   });


   it('simulates click event for enlarge', function() {
     wrapper.unmount();
     wrapper = mountImage();
     wrapper.find('.expandButton').simulate('click');
     expect(largeClick.called).to.be.true;
   });

   it('simulates click event for delete', function() {
    wrapper.unmount();
    wrapper = mountImage();
    wrapper.find('.deleteButton').simulate('click');
    expect(deleteClick.called).to.be.true;
  });

     it('simulates click event for rotation', function() {
     const spy = sinon.spy(OriginalImage.prototype, 'rotate_Click');
     wrapper.find('.rotateButton').simulate('click');
     expect(spy.called).to.be.true;
     spy.restore();
     });
 });