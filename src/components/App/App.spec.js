import React from 'react';
import {mount} from 'enzyme';
import {expect} from 'chai';
import App from './App.js';

describe('App', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <App/>,
      {attachTo: document.createElement('div')}
    );
  });

  afterEach(() => wrapper.detach());

  it('renders a title correctly', () => {
    expect(wrapper.find('h2').length).to.eq(1);
  });

  it('renders the search input correctly', () => {
    expect(wrapper.find('input').length).to.eq(1);
  });

  it('renders a gallry correctly', () => {
    expect(wrapper.find('Gallery').length).to.eq(1);
  });
  it('does not let the tag change in under 700 ms', done => {
    wrapper.setState({
      tag: 'test3'
    }, () => {
      expect(wrapper.find('input').prop('value')).to.not.eq('test3');
      done();
    });
  });

  it('sets the tag correctly after more than 700ms', done => {
    wrapper.setState({
      tag: 'test4'
    }, () => {
      setTimeout(() => {expect(wrapper.find('input').prop('value')).to.eq('test4');}, 800);
      done();
    });
  });
  
});
