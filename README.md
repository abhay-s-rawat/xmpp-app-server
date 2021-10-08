<p >
<a href="https://www.buymeacoffee.com/abhayrawat" target="_blank"><img align="center" src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="30px" width= "108px"></a>
</p> 

# simple xmpp push appserver

Simple XEP-0357 xmpp push app server . External component for ejabberd server (XEP-0357). You can try with other xmpp servers.

Liked my work ? [support me](https://www.buymeacoffee.com/abhayrawat)
If you want to have a quick conversation, you can connect via linkedin. [linkedin](http://linkedin.com/in/abhay-rawat-8478a088)

## myxmpp.sql file contains the basic sql commands to set things in mysql. Just import it to your mysql/maridb server.

## Client (App user) send following iq stanza to register his/her token. 
Device type can be integer representing android or ios. You can remove it if it serves no purpose to you.
node value can be any value decided by you to recognise that user wants to register
iq id can be any string that recognises this stanza.
You can use token value to put into DB. Like I did in this project.

```xml
<iq from="user1ofapp@192.168.1.20" id="cXo5bNCF6wgD" to="localhost" type="set">
  <command xmlns="http://jabber.org/protocol/commands" action="execute" node="register-push">
  <x xmlns="jabber:x:data" type="submit">
      <field var="token">
        <value>yourFCMToken-generatedbyuserdevice</value>
      </field>
      <field var="device_type">
        <value>1</value>
      </field>
    </x>
  </command>
</iq>

```

## Client (App user) send following iq stanza to his xmpp server(ejabberd). 
Here NODE value can be anything that can help distinguish user .
You can use local part of user's JID ex: for user1ofapp@192.168.1.20 use 'user1ofapp'
This node value will be used to identify the record in mysql server.

Here JID value should be the external component if ie: XMPP_EXTERNAL_COMPONENT_DOMAIN from env file.
```xml
<iq type='set' id='x42rtytr'>
  <enable xmlns='urn:xmpp:push:0' jid='localhost' node='user1ofapp'>
  </enable>
</iq>

```

## Edit your ejabberd config file as follows
```yaml
listen:
    port: 5347 # XMPP_EXTERNAL_COMPONENT_PORT
    module: ejabberd_service
    access: all
    shaper_rule: fast
    ip: "::"
    hosts:
      "localhost": # XMPP_EXTERNAL_COMPONENT_DOMAIN
        password: "password" # XMPP_EXTERNAL_COMPONENT_PASSWORD

##### Add include sender and body in mod push module of your ejabberd server according to your needs.
mod_push: 
    include_sender: true
    include_body: true

```

## Env file which contains the necessary values
```env
GOOGLE_APPLICATION_CREDENTIALS="fcm/fcm-service-account-file.json"

DB_HOST=localhost
DB_NAME=myxmpp
DB_USERNAME=admin
DB_PASSWORD=password
DB_TIMEZONE=Z

XMPP_ADDRESS=192.168.1.10
XMPP_EXTERNAL_COMPONENT_PORT=5347
XMPP_EXTERNAL_COMPONENT_DOMAIN=localhost
XMPP_EXTERNAL_COMPONENT_PASSWORD=password

```

## Meaning of some commonly used variables/files used in this project
device_type field contains values which identifies device type ie: for 1 I am assuming: 1 = Android (so will trigger FCM notification)
fcm folder should contain fcm service account file will same name or change name in .env file
