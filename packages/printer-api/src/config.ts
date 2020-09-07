import * as d from 'dotenv'

d.config()

export const config = {
  port: process.env.PORT,
  mongo: {
    uri: process.env.MONGO_URI,
    db: process.env.MONGO_DB,
    collection: process.env.MONGO_COL,
  },
}
