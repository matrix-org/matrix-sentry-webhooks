const fixtures = {
    integrationPlatformIssue: {
        'action': 'created',
        'actor': {
            'id': 'sentry',
            'name': 'Sentry',
            'type': 'application'
        },
        'data': {
            'issue': {
                'annotations': [],
                'assignedTo': null,
                'count': '1',
                'culprit': '?(runner)',
                'firstSeen': '2019-08-19T20:58:37.391000Z',
                'hasSeen': false,
                'id': '1170820242',
                'isBookmarked': false,
                'isPublic': false,
                'isSubscribed': false,
                'lastSeen': '2019-08-19T20:58:37.391000Z',
                'level': 'error',
                'logger': null,
                'metadata': {
                    'filename': '/runner',
                    'type': 'ReferenceError',
                    'value': 'blooopy is not defined'
                },
                'numComments': 0,
                'permalink': null,
                'platform': 'javascript',
                'project': {
                    'id': '1',
                    'name': 'front-end',
                    'platform': '',
                    'slug': 'front-end'
                },
                'shareId': null,
                'shortId': 'FRONT-END-9',
                'status': 'unresolved',
                'statusDetails': {},
                'subscriptionDetails': null,
                'title': 'ReferenceError: blooopy is not defined',
                'type': 'error',
                'userCount': 1,
                'web_url': 'https://domain.tld'
            }
        },
        'installation': {
            'uuid': 'a8e5d37a-696c-4c54-adb5-b3f28d64c7de'
        }
    },
    legacyEvent: {
        project_name: 'test',
        message: 'This is an example Python exception',
        id: '102635',
        culprit: 'raven.scripts.runner in main',
        project_slug: 'test',
        url: 'https://domain.tld/sentry/test/issues/1234/?referrer=webhooks_plugin',
        level: 'error',
        triggering_rules: [],
        event: {
            stacktrace: [{}],
            use_rust_normalize: true,
            extra: [{}],
            modules: {},
            _ref_version: 2,
            _ref: 5,
            culprit: 'raven.scripts.runner in main',
            title: 'This is an example Python exception',
            event_id: '125324325656324623',
            platform: 'python',
            version: '5',
            location: null,
            template: [{}],
            logger: '',
            type: 'default',
            metadata: [{}],
            tags: [[]],
            timestamp: 1586430934.35,
            user: [{}],
            fingerprint: [[]],
            hashes: [[]],
            received: 1586430934.35,
            level: 'error',
            contexts: [{}],
            request: [{}],
            logentry: [{}],
        },
        project: 'test',
        logger: null,
    },
};

module.exports = fixtures;
