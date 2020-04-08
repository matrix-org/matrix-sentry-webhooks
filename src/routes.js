const client = require('./client');
const utils = require('./utils');

const routes = {
    getRoot: (req, res) => {
        res.send('Hey 👋');
    },
    postEvents: (req, res) => {
        if (!utils.verifySignature(req)) {
            res.status(403).end();
            return;
        }
        const event = utils.formatEvent(req.body);

        if (!event) {
            res.json({'result': 'no event found in payload'});
            return;
        }

        const roomId = utils.getRoomForProject(event.project);

        client.sendEvent(roomId, event);

        res.json({'result': 'ok'});
    },
};

module.exports = routes;
