// functions/index.js
const functions = require('firebase-functions');
const fetch = require('node-fetch');
const sgMail = require('@sendgrid/mail');
const twilio = require('twilio');

sgMail.setApiKey(functions.config().sendgrid.key);

// Twilio config
const twilioSid = functions.config().twilio.sid;
const twilioToken = functions.config().twilio.token;
const twilioFrom = functions.config().twilio.from; // e.g. 'whatsapp:+1415XXXXXXX'
const notifyTo = functions.config().notify.to; // e.g. 'whatsapp:+55YYYYYYY'
const notifyEmail = functions.config().notify.email;

const client = twilio(twilioSid, twilioToken);

exports.sendNotification = functions.https.onRequest(async (req, res) => {
  try {
    const data = req.body;
    if(!data || !data.name || !data.email || !data.message) {
      res.status(400).send({error:'missing fields'});
      return;
    }

    // Send email via SendGrid
    const msg = {
      to: notifyEmail,
      from: notifyEmail,
      subject: `Nexus Code - Nova mensagem de ${data.name}`,
      text: `${data.name} (${data.email})\n\n${data.message}`,
      html: `<p><strong>${data.name}</strong> (${data.email})</p><p>${data.message}</p>`
    };
    await sgMail.send(msg);

    // Send WhatsApp via Twilio (if configured)
    if(twilioSid && twilioToken && twilioFrom && notifyTo) {
      await client.messages.create({
        body: `Nexus Code - Nova mensagem de ${data.name}: ${data.message.substring(0,180)}`,
        from: twilioFrom,
        to: notifyTo
      });
    }

    res.status(200).send({ok:true});
  } catch(err) {
    console.error('sendNotification error', err);
    res.status(500).send({error: String(err)});
  }
});
