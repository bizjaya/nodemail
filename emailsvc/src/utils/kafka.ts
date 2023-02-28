import { Kafka } from "kafkajs";
import * as nodemailer  from "nodemailer";
import * as dotenv from 'dotenv' 
dotenv.config()

const env = process.env;



var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.gmail,
    pass: env.gpass
  }
});


const brokers = ["0.0.0.0:9092"];

const topics = ["email-created"] as const;

const kafka = new Kafka({
  brokers,
  clientId: "notifications-service",
});

const consumer = kafka.consumer({
  groupId: "notifications-service",
});

function messageCreatedHandler(data) {
  console.log("Got a new message", JSON.stringify(data, null, 2));

  const { to, sub, body } = data;

  console.log(to);

  var mailOptions = {
    from: env.gmail,
    to: to,
    subject: 'Sending from Consumer',
    text: JSON.stringify(data, null, 2)
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}

const topicToSubscribe: Record<typeof topics[number], Function> = {
  "email-created": messageCreatedHandler,
};

export async function connectConsumer() {
  await consumer.connect();
  console.log("Connected to consumer");

  for (let i = 0; i < topics.length; i++) {
    await consumer.subscribe({
      topic: topics[i],
      fromBeginning: true,
    });
  }

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (!message || !message.value) {
        return;
      }

      const data = JSON.parse(message.value.toString());

      const handler = topicToSubscribe[topic];

      if (handler) {
        handler(data);
      }
    },
  });
}

export async function disconnectConsumer() {
  await consumer.disconnect();
  console.log("Disconnected from consumer");
}
