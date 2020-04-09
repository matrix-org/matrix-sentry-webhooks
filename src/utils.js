const crypto = require('crypto');

const utils = {
    /**
     * Get the right roomId for the given project from MATRIX_ROOMS configuration item.
     * For is <project/roomId> separated by pipe for multiple project/rooms.
     */
    getRoomForProject: project => {
        const roomConfigs = process.env.MATRIX_ROOMS.split('|');
        let roomId = false;
        for (const config of roomConfigs) {
            const roomConfig = config.split('/');
            if (roomConfig[0] === project) {
                roomId = roomConfig[1];
                break;
            }
        }
        return roomId;
    },

     /**
     * Format payload into a message string.
     */
    formatIntegrationPlatformEvent: data => {
        let parts = [];

        if (data.action !== 'created') {
            // Ignore other actions for now
            return;
        }
        if (data.data.issue.level === 'error') {
            parts.push('<strong><span style="color: #ff0000;">ERROR:</span></strong>');
        } else {
            parts.push(`<strong><span style="color: #ff6e2d;">${data.data.issue.level.toUpperCase()}:</span></strong>`);
        }
        parts.push(data.data.issue.project.slug);
        parts.push('|');
        parts.push(`<a href="${data.data.issue.web_url}">${data.data.issue.title}</a>`);
        return parts.join(' ');
    },

     /**
     * Format payload into a message string.
     */
    formatLegacyWebhookEvent: data => {
        let parts = [];

        if (data.level === 'error') {
            parts.push('<strong><span style="color: #ff0000;">ERROR:</span></strong>');
        } else {
            parts.push(`<strong><span style="color: #ff6e2d;">${data.level.toUpperCase()}:</span></strong>`);
        }
        parts.push(data.project_name);
        parts.push('|');
        parts.push(`<a href="${data.url}">${data.message}</a>`);
        return parts.join(' ');
    },

    verifySignature: (request) => {
        const hmac = crypto.createHmac('sha256', process.env.SENTRY_CLIENT_SECRET);
        hmac.update(JSON.stringify(request.body), 'utf8');
        const digest = hmac.digest('hex');
        return digest === request.headers['Sentry-Hook-Signature'];
    },

    verifySecret: (request) => {
        return request.query.secret === process.env.SENTRY_CLIENT_SECRET;
    },
};

module.exports = utils;
