import { config } from './config'
import app from './app'

const PORT = config.port || 3000

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
