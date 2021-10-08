require('dotenv').config();
var db = require('./db_connection.js');
var tokenCache = require('./token_cache.js');
const { component, xml, jid } = require("@xmpp/component");

module.exports = async function (ctx) {
    if ((ctx.element.attrs.action == 'execute') && (ctx.element.attrs.node == 'register-push')) {
        var userJID = ctx.local;
        var token = null;
        var deviceType = null;
        ctx.element.getChild('x').getChildren('field').forEach(element => {
            switch (element.attrs.var) {
                case 'token':
                    token = element.getChild("value").text();
                    break;
                case 'device_type':
                    deviceType = element.getChild("value").text();
                    break;
                default:
                    break;
            }
        });
        if ((userJID == null) || (token == null) || (deviceType == null)) return;
        var success = await db.saveToDB(userJID, token, deviceType);
        if (success == true) {
            tokenCache[userJID] = { notification_token: token, device_type: deviceType };
        }
        return xml(
            "iq", { from: ctx.stanza.attrs.to, type: "result", to: ctx.stanza.attrs.from, id: ctx.id },
        );
    }
};