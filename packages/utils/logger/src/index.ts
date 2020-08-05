import { createLogger, format, transports, Logger } from 'winston'
import * as es from 'winston-elasticsearch'
import { LogData } from 'winston-elasticsearch'

interface LoggerConf {
  level: string
  elacticSearchUrl?: string
  functionName: string
}

const mappingTemplate = {
  index_patterns: ['logs-*'],
  settings: {
    number_of_shards: 1,
    number_of_replicas: 0,
    index: {
      refresh_interval: '5s',
    },
  },
  mappings: {
    _source: { enabled: true },
    properties: {
      '@timestamp': { type: 'date' },
      '@version': { type: 'keyword' },
      message: { type: 'text', index: true },
      severity: { type: 'keyword', index: true },
      functionName: { type: 'keyword', index: true },
      fields: {
        dynamic: true,
        properties: {},
      },
    },
  },
}

const transformer: (functionName: string) => es.Transformer = (
  functionName: string
) => (logData: LogData) => {
  const message =
    typeof logData.message === 'object'
      ? JSON.stringify(logData.message, null, 4)
      : logData.message
  const result = {
    message: message,
    severity: logData.level,
    '@timestamp': new Date().toISOString(),
    fields: logData.meta,
    functionName: functionName,
  }
  return result
}

const esTransportOpts = (
  functionName: string,
  elasticsearchUrl: string,
  level: string
): es.ElasticsearchTransportOptions => {
  return {
    level: level,
    clientOpts: {
      node: elasticsearchUrl,
      maxRetries: 5,
      requestTimeout: 60000,
      sniffOnStart: true,
    },
    transformer: transformer(functionName),
    mappingTemplate: mappingTemplate,
  }
}

export const esLogger = (
  functionName: string,
  elasticsearchUrl: string,
  level: string
): Logger => {
  const logger = createLogger({
    transports: [
      new es.ElasticsearchTransport(
        esTransportOpts(functionName, elasticsearchUrl, level)
      ),
    ],
  })
  return logger
}

const prettyJson = format.printf(info => {
  if (typeof info.message === 'object') {
    info.message = JSON.stringify(info.message, null, 4)
  }
  return `${info.message}`
})

export const consoleLogger = (): Logger => {
  const logger = createLogger({
    level: 'debug',
    format: format.combine(format.splat(), format.simple(), prettyJson),
    transports: [new transports.Console({})],
  })
  return logger
}

export const getLoggerFromAsync = (asyncConf: Promise<LoggerConf>) => {
  const logger = consoleLogger()
  asyncConf.then(conf => {
    if (conf.elacticSearchUrl) {
      logger.transports.forEach(transport => logger.remove(transport))
      logger.add(
        new es.ElasticsearchTransport(
          esTransportOpts(conf.functionName, conf.elacticSearchUrl, conf.level)
        )
      )
    }
  })
  return logger
}

export const logger = consoleLogger()
