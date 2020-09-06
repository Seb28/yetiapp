import { Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import * as Ajv from 'ajv'
import * as ticketSchema from '../../ressources/ticket.json'
import reader from 'readline-sync'

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

export class TicketController {
  public async update(req: Request, res: Response) {
    const yetiId = req.query['yetiId']
    const ticket = req.body.ticket
    const isValid = ajv.validate(ticketSchema, ticket)
    if (!isValid) {
      const errorMessages = ajv.errorsText()
      console.warn('E_01', 'Validation Error', errorMessages)
      res.status(400).send('E_01 - Validation Error. - ' + errorMessages)
    } else {
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
      res.append('Access-Control-Allow-Origin', ['*'])
      res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
      res.append('Access-Control-Allow-Headers', 'Content-Type')

      res.json({
        yetiId: yetiId,
        ticket: ticket,
      })
    }
  }
  public async add(req: Request, res: Response) {
    const ticket = req.body
    const isValid = ajv.validate(ticketSchema, ticket)
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

      res.json({
        yetiId: yetiId,
        ticket: ticket,
      })
    }
  }
}
