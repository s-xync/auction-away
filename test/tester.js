var expect  = require('chai').expect;
var request = require('request');

it('Main page status', function(done) {
    request('http://localhost:3000' , function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
    });
});


it('About page content', function(done) {
    request('http://localhost:3000/about' , function(error, response, body) {
        expect(response.statusCode).to.equal(404);
        done();
    });
});

it('Auction page status', function(done) {
    request('http://localhost:3000/auctions/addauction' , function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
    });
});

it('User page status', function(done) {
    request('http://localhost:3000/users/login' , function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
    });
});