import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import {expect} from 'chai';
import Image from './Image.js';
//import Gallery from '../Gallery/Gallery.js';

describe('Image', () => {

  const sampleImage = {id: '28420720169', owner: '59717246@N05', secret: 'd460443ecb', server: '4722', farm: 5};

  let wrapper;
  const galleryWidth = 1111;

  const mountImage = () => {
    return shallow(
      <Image
        dto={sampleImage}
        imageIndex='0'
        galleryWidth={galleryWidth}
        deleteClick={(() => {})}
        largeClick={(() => {})}
        />,
      {lifecycleExperimental: true, attachTo: document.createElement('div')}
    );
  };

  beforeEach(() => {
    wrapper = mountImage();
  });

  it('render 3 icons on each image', () => {
    expect(wrapper.find('FontAwesome').length).to.equal(3);
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
    const spy = sinon.spy(Image.prototype, 'rotate_Click');
    wrapper.find('.rotateButton').simulate('click');
    expect(spy.called).to.be.true;
    spy.restore();
  });
});