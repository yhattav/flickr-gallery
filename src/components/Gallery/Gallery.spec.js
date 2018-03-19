import React from 'react';
import {mount, shallow} from 'enzyme';
import {expect} from 'chai';
import sinon from 'sinon';
import moxios from 'moxios';
import Gallery from './Gallery.js';

describe('Gallery', () => {

  const initialImages = [
    {id: '28420720169', owner: '59717246@N05', secret: 'd460443ecb', server: '4722', farm: 5},
    {id: '39489067804', owner: '132444237@N06', secret: 'befff859cf', server: '4658', farm: 5},
    {id: '40167481242', owner: '76670355@N04', secret: '32eefbdbaa', server: '4743', farm: 5},
    {id: '39488925224', owner: '31479578@N03', secret: '50ef68484e', server: '4695', farm: 5},
    {id: '28420574019', owner: '129547346@N08', secret: '1299bb8029', server: '4712', farm: 5},
    {id: '39302267095', owner: '137639620@N02', secret: 'b891c7d131', server: '4711', farm: 5},
    {id: '28420470529', owner: '150051933@N05', secret: '0be4664473', server: '4603', farm: 5},
    {id: '26327535078', owner: '51483961@N03', secret: '5f30961f45', server: '4702', farm: 5},
    {id: '40166902122', owner: '150995138@N06', secret: '2b46fdb817', server: '4716', farm: 5},
    {id: '39301783895', owner: '156204685@N03', secret: '475b6645b9', server: '4761', farm: 5},
    {id: '39301758945', owner: '28549294@N05', secret: 'e6ccd03a1b', server: '4719', farm: 5}
  ];

  const nextImages = [
    {id: '28420720170', owner: '59717246@N05', secret: 'd460443ecb', server: '4722', farm: 5},
    {id: '39489067880', owner: '132444237@N06', secret: 'befff859cf', server: '4658', farm: 5},
    {id: '26327535090', owner: '51483961@N03', secret: '5f30961f45', server: '4702', farm: 5},
    {id: '40166902110', owner: '150995138@N06', secret: '2b46fdb817', server: '4716', farm: 5},
    {id: '39301783820', owner: '156204685@N03', secret: '475b6645b9', server: '4761', farm: 5},
    {id: '39301758930', owner: '28549294@N05', secret: 'e6ccd03a1b', server: '4719', farm: 5}
  ];

  //const galleryWidth = wrapper.getGalleryWidth();

  let wrapper;

  const mountGallery = () => {
    return shallow(
      <Gallery tag='test2' />,
      {lifecycleExperimental: true, attachTo: document.createElement('div')}
    );
  };

  beforeEach(() => {
    wrapper = mount(
      <Gallery/>,
      {attachTo: document.createElement('div')}
    );
  });
  // afterEach(() => {
  //     spy.restore();
  // });

  it('renders', () => {
    expect(wrapper).to.not.be.undefined;
  });

  it('renders all images on the state', done => {
    wrapper.setState({
      images: initialImages
    }, () => {
      expect(wrapper.children().children('Image').length).to.eq(initialImages.length);
      done();
    });
  });

  it('renders a Backtop correctly', () => {
    expect(wrapper.find('Backtop').length).to.eq(1);
  });

 


  it('calc image size on mount', () => {
    const spy = sinon.spy(Gallery.prototype, 'calcImageSize');
    wrapper = mountGallery();
    expect(spy.called).to.be.true;
    spy.restore();
  });

 it('calc image size on resize', () => {
    const spy = sinon.spy(Gallery.prototype, 'calcImageSize');
    wrapper = mountGallery();
    wrapper.instance().handleResize();
    expect(spy.called).to.be.true;
    spy.restore();
  });
  it('calculate image size correctly', () => {
    wrapper = mountGallery();
    const galleryWidth = wrapper.instance().getGalleryWidth();
    const imageSize = wrapper.state().imageSize;
    const remainder = galleryWidth % imageSize;
    expect(remainder).to.be.lessThan(1);
  });

  it('get new images on every tag change', done => {
    moxios.install();
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: {
          photos: {
            photo: nextImages
          }
        }
      }).then(() => {
        expect(wrapper.state().images.length).to.eq(nextImages.length);
        done();
        moxios.uninstall();
      });
    });
    wrapper.setProps({tag: 'test2'});
      //wrapper.instance().handleScroll();
      //wrapper.instance().handleScroll();

  });

    it('gets more images on scroll to bottom on top of existing images', done => {
      wrapper.setState({
      images: initialImages
    });
    moxios.install();
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: {
          photos: {
            photo: nextImages
          }
        }
      }).then(() => {
        expect(wrapper.state().images.length).to.eq(initialImages.length+nextImages.length);
        done();
        moxios.uninstall();
      });
    });
      wrapper.instance().handleScroll();
  });


});
