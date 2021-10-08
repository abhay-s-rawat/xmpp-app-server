require('dotenv').config();
var db = require('./db_connection.js');
var tokenCache = require('./token_cache.js');
const { component, xml, jid } = require("@xmpp/component");

var fcm = require("firebase-admin");
const { text } = require('body-parser');
fcm.initializeApp({
    credential: fcm.credential.applicationDefault()
});
module.exports = async function (ctx) {
    var result = await handleNotification(ctx.element.getChild("publish").attrs.node, ctx.element.getChild("publish").getChild('item').getChild('notification').getChild('x').getChildren('field'));
    console.log(result);
    return xml(
        "iq", { from: ctx.stanza.attrs.to, type: "result", to: ctx.stanza.attrs.from, id: ctx.id },
    );
};
async function handleNotification(userJID, msgData) {
    var msgCount = 0;
    var msgSender = null;
    var msgBody = null;
    var targetDeviceType = null;
    var targetDeviceToken = null;
    var message = null;
    try {
        msgData.forEach(element => {
            switch (element.attrs.var) {
                case 'message-count':
                    msgCount = element.getChild("value").text();
                    break;
                case 'last-message-sender':
                    msgSender = element.getChild("value").text();
                    break;
                case 'last-message-body':
                    msgBody = element.getChild("value").text();
                    break;
                default:
                    break;
            }
        });
        if ((msgSender == null) || (msgBody == null)) return null;
        if (tokenCache.hasOwnProperty(userJID)) {
            targetDeviceToken = tokenCache[userJID].notification_token;
            targetDeviceType = tokenCache[userJID].device_type;
        } else {
            var resp = await db.searchDB(userJID);
            if (resp.hasError == false) {
                targetDeviceToken = resp.notification_token;
                targetDeviceType = resp.device_type;
                tokenCache[userJID] = { notification_token: resp.notification_token, device_type: resp.device_type };
            }
        }
        if ((targetDeviceToken == null) || (targetDeviceType == null)) return null;
        if (targetDeviceType == 1) { // 1 = Android so it will trigger FCM notification
            message = {
                data: {
                    fromJid: msgSender.toString(),
                    toUsername: userJID.toString(),
                    count: msgCount.toString(),
                    msgBody: msgBody.toString()
                },
                android: {
                    priority: "high"
                },
                token: targetDeviceToken
            };
            console.log(message);
            var resp = await fcm.messaging().send(message, false);
            console.log(resp);
            return resp;
        }
        else {
            return null;
        }
    } catch (e) {
        //console.log(e);
        return null;
    }
}