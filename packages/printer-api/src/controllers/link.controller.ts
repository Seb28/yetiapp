import { Request, Response } from 'express'
import * as Ajv from 'ajv'
import * as linkSchema from '../../ressources/linkTicket.json'
import reader from 'readline-sync'
import { MongoClient } from '@yeti/mongo-util'

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
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    )
    res.header(
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
    )
    if ('OPTIONS' == req.method) {
      res.sendStatus(200)
    } else {
      const ticket = req.body
      const isValid = ajv.validate(linkSchema, ticket)
      if (!isValid) {
        const errorMessages = ajv.errorsText()
        console.warn('E_01', 'Validation Error', errorMessages)
        res.status(400).send('E_01 - Validation Error. - ' + errorMessages)
      } else {
        const yetiId = uuid()
        const message = JSON.stringify({
          yetiId: yetiId,
          ticket: ticket,
        })

        // await producer.connect()
        // try {
        //   await sendPayload(message)
        // } catch (e) {
        //   console.error('E_02', 'Kafka Error', e)
        //   res.status(500).send('E_02 - Kafka Error. - ' + e)
        // }

        MongoClient

        res.json({
          yetiId: yetiId,
          ticket: ticket,
        })
      }
    }
  }
}
