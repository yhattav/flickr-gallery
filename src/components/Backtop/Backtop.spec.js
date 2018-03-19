// import 'jsdom-global/register';
import React from 'react';
import {shallow} from 'enzyme';
//import sinon from 'sinon';
import {expect} from 'chai';
import Backtop from './Backtop.js';

 describe('Backtop', () => {

   let wrapper;
//   const galleryWidth = 1111;

   const mountBacktop = () => {
     
     return shallow(
       <Backtop />,
       {lifecycleExperimental: true, attachTo: document.createElement('div')}
     );
   };

//    beforeEach(() => {
//      wrapper = mountBacktop();
//    });

   it('renders', () => {
    wrapper = mountBacktop();
    expect(wrapper).to.not.be.undefined;
  });


   it('render 1 arrow icon', () => {
    wrapper = mountBacktop();
     expect(wrapper.find('.arrow-up').length).to.equal(1);
   });

    // it("simulates click event for getting back to top", () => {   // cant call handletopclick without its internals - and i cant test those? works if i remove them from within the method
    // const spy = sinon.spy(Backtop.prototype, 'handleTopClick');
    // wrapper.find("div").simulate('click');
    // expect(spy.called).to.be.true;
    // spy.restore();
    // });



 });
