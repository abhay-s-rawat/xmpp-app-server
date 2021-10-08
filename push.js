require('dotenv').config();
const { component, xml, jid } = require("@xmpp/component");
const debug = require("@xmpp/debug");

var registerPush = require("./register_push_handler.js");
var pushHandler = require("./send_notifications_handler.js");

const xmpp = component({
    service:  'xmpp://' +process.env.XMPP_ADDRESS +':' +process.env.XMPP_EXTERNAL_COMPONENT_PORT, //"xmpp://192.168.1.25:5347"
    domain: process.env.XMPP_EXTERNAL_COMPONENT_DOMAIN,
    password: XMPP_EXTERNAL_COMPONENT_PASSWORD,
});
const { iqCallee } = xmpp;
debug(xmpp, true);
//Handlers
iqCallee.set("http://jabber.org/protocol/commands", "command", registerPush);
iqCallee.set("http://jabber.org/protocol/pubsub", "pubsub", pushHandler);

xmpp.on("error", (err) => { console.error(err); });
xmpp.on("offline", () => { console.log("offline"); });
xmpp.on("stanza", (stanza) => {
    //console.log(stanza);
});
xmpp.on("online", async (address) => { console.log("online as", address.toString()); });
xmpp.start().catch(console.error);