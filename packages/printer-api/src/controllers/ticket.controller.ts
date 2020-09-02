import { Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import * as Ajv from 'ajv'
import * as ticketSchema from '../../ressources/Ticket.json'
import reader from 'readline-sync'

import { Kafka } from 'kafkajs'

const kafka = new Kafka({
  clientId: 'test-app',
  brokers: ['localhost:9192'],
})

const producer = kafka.producer({
  maxInFlightRequests: 1,
  idempotent: true,
  transactionalId: 'uniqueProducerId',
})

async function sendPayload(input: string) {
  try {
    await producer.send({
      topic: 'tickets',
      messages: [{ key: 'test', value: input }],
    })
  } catch (e) {
    console.error('Caught Error while sending:', e)
  }
}

export class TicketController {
  public async index(req: Request, res: Response) {
    const ajv = new Ajv()
    const data = req.body
    const isValid = ajv.validate(ticketSchema, data)
    if (!isValid) {
      const errorMessages = ajv.errorsText()
      console.warn('E_01', 'Validation Error', errorMessages)
      res.status(400).send('E_01 - Validation Error. - ' + errorMessages)
    } else {
      const yetiId = uuid()
      const message = JSON.stringify({
        yetiId: yetiId,
        ticket: data,
      })

      await producer.connect()
      try {
        await sendPayload(message)
      } catch (e) {
        console.error('E_02', 'Kafka Error', e)
        res.status(500).send('E_02 - Kafka Error. - ' + e)
      }

      res.json({
        yetiId: yetiId,
      })
    }
  }
}
