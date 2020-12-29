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
        parts.push(data.project_name, '|');
        if (data.event.environment) {
            parts.push(data.event.environment, '|');
        }
        parts.push(`<a href="${data.url}">${data.event.title || data.message}</a>`);
        if (data.event.request && data.event.request.url) {
            parts.push(`<br>Url: <i>${data.event.request.url.replace(/https?:\/\//gi, '')}</i>`);
            if (data.event.request.headers) {
                let referer = data.event.request.headers.filter(h => h[0] === 'Referer');
                if (referer) {
                    console.log(referer);
                    console.log(typeof referer);
                    if (typeof referer === 'string') {
                        referer = referer.replace(/https?:\/\//gi, '');
                    } else if (typeof referer == 'object' && referer.length > 1) {
                        referer = referer[1].replace(/https?:\/\//gi, '');
                    } else {
                        referer = JSON.stringify(referer).replace(/https?:\/\//gi, '');
                    }
                    parts.push(`referer <i>${referer}</i>`);
                }
            }
        }
        if (data.event.contexts && data.event.contexts.browser) {
            parts.push(`<br>Browser: <i>${JSON.stringify(data.event.contexts.browser)}</i>`);
        }
        if (data.event.culprit) {
            parts.push(`<br>Culprit: <i>${data.event.culprit}</i>`);
        }
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
