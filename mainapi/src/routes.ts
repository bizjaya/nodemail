import { FastifyInstance } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { MessageModel } from "./models/message.model";
import { sendMessage } from "./utils/kafka";

const createProductBody = {
  type: "object",
  properties: {
    to: { type: "string" },
    sub: { type: "string" },
    body: { type: "string" },
  },
  required: ["to","sub","body"],
} as const;

export async function routes(app: FastifyInstance) {
  app.post<{ Body: FromSchema<typeof createProductBody> }>(
    "/",
    {
      schema: {
        body: createProductBody,
      },
    },
    async (req, reply) => {
      const { to, sub, body } = req.body;

      // const message = await MessageModel.create({
      //   text,
      // });

      await sendMessage("email-created", JSON.stringify({ to: to, sub: sub, body: body }));


      return reply.code(200).send("ok");
      
    //  return reply.code(201).send(message);
    }
  );
}
