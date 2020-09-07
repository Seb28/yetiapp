import { Request, Response } from 'express'
import * as Ajv from 'ajv'
import { config } from '../config'
import * as linkSchema from '../../ressources/linkTicket.json'
import * as m from 'mongodb'
import reader from 'readline-sync'
import assert = require('assert')

// import { Kafka } from 'kafkajs'

const ajv = new Ajv()
// const kafka = new Kafka({
//   clientId: 'test-app',
//   brokers: ['localhost:9192'],
// })

// const producer = kafka.producer({
//   maxInFlightRequests: 1,
//   idempotent: true,
//   transactionalId: 'uniqueProducerId',
// })

// async function sendPayload(input: string) {
//   try {
//     await producer.send({
//       topic: 'tickets',
//       messages: [{ key: 'test', value: input }],
//     })
//   } catch (e) {
//     console.error('Caught Error while sending:', e)
//   }
// }

export class LinkController {
  public async link(req: Request, res: Response) {
    const link = req.body
    const client = await m.connect(config.mongo.uri, {
      useUnifiedTopology: true,
    })
    const db = client.db(config.mongo.db)

    const isValid = ajv.validate(linkSchema, link)
    if (!isValid) {
      const errorMessages = ajv.errorsText()
      console.warn('E_01', 'Validation Error', errorMessages)
      res.status(400).send('E_01 - Validation Error. - ' + errorMessages)
    } else {
      const yetiId = link.yetiId
      const userId = link.userId

      const update = await db
        .collection(config.mongo.collection)
        .updateOne({ yetiId: yetiId }, { $set: { userId: userId } })
      const ticket = await db
        .collection(config.mongo.collection)
        .find({ yetiId: yetiId })
        .toArray()
      client.close()
      res.status(200).send(ticket[0])
    }
  }
}
