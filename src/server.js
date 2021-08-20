import express from "express"
import cors from "cors"
import listEndpoints from "express-list-endpoints"
import moviesRouter from "./services/movies/index.js"
import commentsRouter from "./scomments/index.js"
import {
  notFoundErrorHandler,
  badRequestErrorHandler,
  forbiddenErrorHandler,
  genericServerErrorHandler,
} from "./errorHandlers.js"
import { join } from "path"

const server = express()
const port = process.env.PORT
const publicFolderPath = join(process.cwd(), "public")

// CORS
const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL]

const corsOpts = {
  origin: (origin, next) => {
    console.log("Origin --> ", origin)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      next(null, true)
    } else {
      next(new Error(`Origin ${origin} is not allowed`))
    }
  },
}

//=========== GLOBAL MIDDLEWARES ======================
server.use(express.static(publicFolderPath)) //grants access to the public folder in the url
server.use(cors(corsOpts))
server.use(express.json()) // this will enable reading of the bodies of requests, THIS HAS TO BE BEFORE server.use("/authors", authorsRouter)

// ========== ROUTES =======================
server.use("/movies", moviesRouter)
server.use("/comments", commentsRouter) // this will provide the endpoints of authors with a common name to POST, GET, PUT and DELETE

// ============== ERROR HANDLING ==============

server.use(notFoundErrorHandler)
server.use(badRequestErrorHandler)
server.use(forbiddenErrorHandler)
server.use(genericServerErrorHandler)

console.table(listEndpoints(server)) // will show us the detailed endpoints in a table

server.listen(port, () =>
  console.log(`Server is listening to the port ${port}.`)
)
