const { expect } = require('chai');
const request = require('request');

it('Main page content', (done) => {
  request('http://localhost:8080', (error, response, body) => {
    expect(body).to.equal('Hello');
    done();
  });
});
