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
        if (data.event.release) {
            parts.push(data.event.release, '|');
        }
        parts.push(`<a href="${data.url}">${data.event.title || data.message}</a>`);
        if (data.event.request && data.event.request.url) {
            parts.push(`<br>Url: <i>${data.event.request.url.replace(/https?:\/\//gi, '')}</i>`);
            if (data.event.request.headers) {
                const referer = data.event.request.headers.filter(h => h[0] === 'Referer');
                if (referer) {
                    try {
                        parts.push(`referer <i>${referer[0][1].replace(/https?:\/\//gi, '')}</i>`);
                    } catch (e) {
                        parts.push(`referer <i>${JSON.stringify(referer.replace(/https?:\/\//gi, ''))}</i>`);
                    }
                }
            }
        }
        if (data.event.contexts && data.event.contexts.browser) {
            parts.push(`<br>Browser: <i>${JSON.stringify(data.event.contexts.browser)}</i>`);
        }
        if (data.event.culprit) {
            parts.push(`<br>Culprit: <i>${data.event.culprit}</i>`);
        }
        const includeTags = (process.env.SENTRY_INCLUDE_TAGS || '').split(',');
        if (includeTags.length > 0) {
            for (const tag of includeTags) {
                const tagData = data.event.tags.filter(t => t[0] === tag);
                if (tagData.length > 0 && tagData[0].length > 1) {
                    parts.push(`<br>${tag}: <i>${tagData[0][1]}</i>`);
                }
            }
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
