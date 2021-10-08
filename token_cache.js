module.exports = {};
// This will create a object which keys will be user's JID's local part. This will be used as cache.
/*
I could have used arrays but finding element in a array is big deal, so its better to create a object and its keys are extremely quick to retrieve.(O(1))
Ex: At some instant it will have values like
{
    'user1jid': {
        'notification_token': 'some token given by fcm',
        'device_type': 1
    },
        'user2jid': {
        'notification_token': 'some token given by fcm',
        'device_type': 1
    },
        'user3jid': {
        'notification_token': 'some token given by fcm',
        'device_type': 1
    },
        'user4jid': {
        'notification_token': 'some token given by fcm',
        'device_type': 1
    },
    .
    .
    .
    .
    .
    .
    .
}
*/