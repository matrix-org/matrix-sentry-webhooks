const chai = require('chai');
const sinon = require('sinon');
const client = require('../src/client');
const fixtures = require('./fixtures');
const routes = require('../src/routes');
const utils = require('../src/utils');

const expect = chai.expect;
require('dotenv').config({path: '.env.default'});

describe('routes', function() {
    describe('getRoot', function() {
        it('waves', function() {
            let req = {};
            let res = {
                send: sinon.spy()
            };
            routes.getRoot(req, res);

            expect(res.send.calledOnce).to.be.true;
            expect(res.send.firstCall.args[0]).to.equal('Hey 👋');
        });
    });

    describe('postEvents', function() {
        before(function() {
            this.clientStub = sinon.stub(client, 'sendEvent').returns(true);
            this.utilsStub = sinon.stub(utils, 'verifySignature').returns(true);
            this.req = {
                body: fixtures.issue,
            };
            this.res = {
                json: sinon.spy(),
                status: sinon.spy(),
            };
        });

        it('calls client sendEvent for each event', function() {
            routes.postEvents(this.req, this.res);

            expect(this.clientStub.calledOnce).to.be.true;
        });

        it('calls formatEvent', function() {
            const formatStub = sinon.stub(utils, 'formatEvent').returns('');

            routes.postEvents(this.req, this.res);

            expect(formatStub.calledOnce).to.be.true;
            expect(formatStub.firstCall.args[0]).to.eql(fixtures.issue);

            formatStub.restore();
        });

        it('returns ok', function() {
            routes.postEvents(this.req, this.res);

            expect(this.res.json.calledOnce).to.be.true;
            expect(this.res.json.firstCall.args[0]).to.eql({'result': 'ok'});
        });

        afterEach(function() {
            this.clientStub.resetHistory();
            this.utilsStub.resetHistory();
            sinon.resetHistory(this.res.json);
            sinon.resetHistory(this.res.status);
        });

        after(function() {
            this.clientStub.reset();
            this.utilsStub.reset();
        });
    });
});
