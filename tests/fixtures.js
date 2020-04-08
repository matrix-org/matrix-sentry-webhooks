const fixtures = {
    issue: {
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
    }
};

module.exports = fixtures;
