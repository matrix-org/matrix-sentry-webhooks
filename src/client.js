const matrix = require('matrix-js-sdk');
const striptags = require('striptags');

let joinedRoomsCache = [];

const client = {
    init: function() {
        // Init Matrix client
        this.connection = matrix.createClient({
            baseUrl: process.env.MATRIX_HOMESERVER_URL,
            accessToken: process.env.MATRIX_TOKEN,
            userId: process.env.MATRIX_USER,
            localTimeoutMs: 10000,
        });

        // Ensure in right rooms
        this.connection.getJoinedRooms().then(rooms => {
            joinedRoomsCache = rooms.joined_rooms;
            const roomConfigs = process.env.MATRIX_ROOMS.split('|');
            roomConfigs.forEach(roomConfig => {
                const room = roomConfig.split('/');
                this.ensureInRoom(room[1]);
            });
        });
    },

    ensureInRoom: async function(roomId) {
        if (joinedRoomsCache.indexOf(roomId === -1)) {
            try {
                const room = await client.connection.joinRoom(roomId);
                if (room) {
                    joinedRoomsCache.push(room.roomId);
                }
            } catch (ex) {
                console.warn(`Could not join room ${roomId} - ${ex}`);
            }
        }
    },

    sendEvent: function(roomId, event) {
        try {
            this.ensureInRoom(roomId)
                .then(() => {
                    this.connection.sendEvent(
                        roomId,
                        'm.room.message',
                        {
                            'body': striptags(event),
                            'formatted_body': event,
                            'msgtype': 'm.text',
                            'format': 'org.matrix.custom.html'
                        },
                        '',
                    );
                });
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err);
        }
    },
};

module.exports = client;
