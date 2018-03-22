import React from 'react';
import {mount, shallow} from 'enzyme';
import {expect} from 'chai';
import ImageMagnifier from './ImageMagnifier.js';

 describe('ImageMagnifier', () => {

let wrapper;
   beforeEach(() => {
    wrapper = mount(
      <ImageMagnifier image={{
                    src: 'http://farm2.staticflickr.com/1103/567229075_2cf8456f01_s.jpg',
                    width: 100,
                    height: 100
                }}
                zoomImage={{
                    src: 'http://farm2.staticflickr.com/1103/567229075_2cf8456f01_s.jpg',
                    width: 200,
                    height: 200
                }}
                cursorOffset={{ x: 120, y: 120 }}/>,
      {attachTo: document.createElement('div')}
    );
  });
      it('renders', () => {
      expect(wrapper).to.not.be.undefined;
    });


 });
