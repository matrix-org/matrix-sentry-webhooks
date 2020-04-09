const chai = require('chai');
const sinon = require('sinon');
const client = require('../src/client');
const fixtures = require('./fixtures');
const routes = require('../src/routes');
const utils = require('../src/utils');

const expect = chai.expect;
require('dotenv').config({path: '.env.default'});

describe('routes', function() {
    before(function() {
        this.clientStub = sinon.stub(client, 'sendEvent').returns(true);
        this.roomStub = sinon.stub(utils, 'getRoomForProject').returns('!foobar:domain.tld');
        this.res = {
            json: sinon.spy(),
            status: sinon.spy(),
        };
    });

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
        describe('integration platform issues', () => {
            before(function() {
                this.verifyStub = sinon.stub(utils, 'verifySignature').returns(true);
                this.formatStub = sinon.stub(utils, 'formatIntegrationPlatformEvent').returns('foobar');
                this.req = {
                    body: fixtures.integrationPlatformIssue,
                    headers: {
                        'Sentry-Hook-Signature': 'foobar',
                    },
                };
            });

            it('calls client sendEvent for each event', function() {
                routes.postEvents(this.req, this.res);

                expect(this.clientStub.calledOnce).to.be.true;
            });

            it('calls formatEvent', function() {
                routes.postEvents(this.req, this.res);

                expect(this.formatStub.calledOnce).to.be.true;
                expect(this.formatStub.firstCall.args[0]).to.eql(fixtures.integrationPlatformIssue);
            });

            it('skips if signature verification fails', function() {
                this.verifyStub.returns(false);
                try {
                    routes.postEvents(this.req, this.res);
                // eslint-disable-next-line no-empty
                } catch (e) {}

                expect(this.res.status.calledOnce).to.be.true;
                expect(this.formatStub.calledOnce).to.be.false;
            });

            it('returns ok', function() {
                routes.postEvents(this.req, this.res);

                expect(this.res.json.calledOnce).to.be.true;
                expect(this.res.json.firstCall.args[0]).to.eql({});
            });

            afterEach(function() {
                this.verifyStub.resetHistory();
                this.formatStub.resetHistory();
                this.verifyStub.returns(true);
                sinon.resetHistory(this.res.json);
                sinon.resetHistory(this.res.status);
            });

            after(function() {
                this.verifyStub.reset();
                this.formatStub.reset();
            });
        });

        describe('legacy webhook events', () => {
            before(function() {
                this.formatStub = sinon.stub(utils, 'formatLegacyWebhookEvent').returns('foobar');
                this.verifyStub = sinon.stub(utils, 'verifySecret').returns(true);
                this.req = {
                    body: fixtures.legacyEvent,
                    query: {
                        secret: 'foobar',
                    },
                    headers: {},
                };
            });

            it('calls client sendEvent for each event', function() {
                routes.postEvents(this.req, this.res);

                expect(this.clientStub.calledOnce).to.be.true;
            });

            it('calls formatEvent', function() {
                routes.postEvents(this.req, this.res);

                expect(this.formatStub.calledOnce).to.be.true;
                expect(this.formatStub.firstCall.args[0]).to.eql(fixtures.legacyEvent);
            });

            it('skips if secret verification fails', function() {
                this.verifyStub.returns(false);
                try {
                    routes.postEvents(this.req, this.res);
                // eslint-disable-next-line no-empty
                } catch (e) {}

                expect(this.res.status.calledOnce).to.be.true;
                expect(this.formatStub.calledOnce).to.be.false;
            });

            it('returns ok', function() {
                routes.postEvents(this.req, this.res);

                expect(this.res.json.calledOnce).to.be.true;
                expect(this.res.json.firstCall.args[0]).to.eql({});
            });

            afterEach(function() {
                this.formatStub.resetHistory();
                this.verifyStub.resetHistory();
                this.verifyStub.returns(true);
                sinon.resetHistory(this.res.json);
                sinon.resetHistory(this.res.status);
            });

            after(function() {
                this.formatStub.reset();
                this.verifyStub.reset();
            });
        });
    });

    afterEach(function() {
        this.clientStub.resetHistory();
        this.roomStub.resetHistory();
        sinon.resetHistory(this.res.json);
        sinon.resetHistory(this.res.status);
    });

    after(function() {
        this.clientStub.reset();
        this.roomStub.reset();
    });
});
