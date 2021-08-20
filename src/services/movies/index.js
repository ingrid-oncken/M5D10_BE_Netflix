import express from "express"
import {
  readMovies,
  writeMovies,
  savePosterCloudinary,
} from "../../lib/writeReadTools.js"
import uniqid from "uniqid"
import createHttpError from "http-errors"
import { validationResult } from "express-validator"
import { moviesValidation, movieCommentValidation } from "./validation.js"
import multer from "multer"

const movies = express.Router()

// =============== MOVIES INFORMATION =================

movies.get("/", async (req, res, next) => {
  try {
    const movies = await readMovies()
    console.log(movies)

    if (req.query && req.query.title) {
      const filteredmovies = movies.filter((m) =>
        m.title
          .toLocaleLowerCase()
          .includes(req.query.title.toLocaleLowerCase())
      )
      res.send(filteredmovies)
    } else {
      res.send(movies)
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

movies.get("/:imdbID", async (req, res, next) => {
  try {
    const paramsImdbID = req.params.imdbID
    const movies = await readMovies()
    const movie = movies.find((m) => m.imdbID === paramsImdbID)
    if (movie) {
      res.send(movie)
    } else {
      res.send(
        createHttpError(
          404,
          `The movie with id: ${paramsImdbID} was not found.`
        )
      )
    }
  } catch (error) {
    next(error)
  }
})

movies.post("/", moviesValidation, async (req, res, next) => {
  try {
    const errorList = validationResult(req)
    if (errorList.isEmpty()) {
      const movies = await readMovies()
      const oneMovie = movies[Math.floor(Math.random() * movies.length)]
      const movies = await readMovies()
      const newMovie = {
        Title: `${oneMovie.Title}`,
        Year: `${oneMovie.Year}`,
        imdbID: uniqid(),
        Type: "movie",
        Poster: `${posterUrl}`,
        comments: [
          {
            // _id: "123455", //SERVER GENERATED
            comment: `${oneMovie.comment}`,
            rate: `${oneMovie.rate}`,
            elementId: uniqid(),
            createdAt: new Date(),
          },
        ],
        ...req.body,
      }

      movies.push(newMovie)
      await writeMovies(movies)

      res.status(201).send(newMovie)
    } else {
      next(createHttpError(400, { errorList }))
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

movies.put("/:imdbID", moviesValidation, async (req, res, next) => {
  try {
    const errorList = validationResult(req)
    if (errorList.isEmpty()) {
      const paramsImdbID = req.params.imdbID
      const movies = await readMovies()
      const movieToUpdate = movies.find((m) => m.imdbID === paramsImdbID)

      const updatedMovie = { ...movieToUpdate, ...req.body }

      const remainingMovies = movies.filter((m) => m.imdbID !== paramsImdbID)

      remainingMovies.push(updatedMovie)
      await writeMovies(remainingMovies)

      res.send(updatedMovie)
    } else {
      next(createHttpError(400, { errorList }))
    }
  } catch (error) {
    next(error)
  }
})

movies.delete("/:imdbID", async (req, res, next) => {
  try {
    const paramsImdbID = req.params.imdbID
    const movies = await readMovies()
    const movie = movies.find((m) => m.imdbID === paramsImdbID)
    if (movie) {
      const remainingMovies = movies.filter((m) => m.imdbID !== paramsImdbID)

      await writeMovies(remainingMovies)

      res.send({
        message: `The movie with the id: ${movie.imdbID} was deleted`,
        movie: movie,
      })
    } else {
      next(
        createHttpError(
          404,
          `The movie with the id: ${paramsImdbID} was not found`
        )
      )
    }
  } catch (error) {
    next(error)
  }
})

// =============== MOVIES POSTERS =================
movies.post(
  "/:imdbID/uploadPoster",
  multer({ storage: savePosterCloudinary }).single("Poster"),
  async (req, res, next) => {
    try {
      const paramsImdbID = req.params.imdbID
      const movies = await readMovies()
      const movie = movies.find((m) => m.imdbID === paramsImdbID)
      if (movie) {
        const posterUrl = req.file.path
        const updatedMovie = { ...movie, Poster: posterUrl }
        const remainingMovies = movies.filter(
          (mp) => mp.imdbID !== paramsImdbID
        )

        remainingMovies.push(updatedMovie)
        await writeMovies(remainingMovies)
        res.send(updatedMovie)
      } else {
        next(
          createHttpError(
            404,
            `The movie with the id: ${paramsImdbID} was not found.`
          )
        )
      }
    } catch (error) {
      next(error)
    }
  }
)

// =============== MOVIES COMMENTS =================
movies.get("/:imdbID/comments", async (req, res, next) => {
  try {
    const paramsImdbID = req.params.imdbID
    const movies = await readMovies()
    const movie = movies.find((m) => m.imdbID === paramsImdbID)
    if (movie) {
      const movieComments = movie.comments
      res.send(movieComments)
    } else {
      next(
        createHttpError(
          404,
          `The movie with the id: ${paramsImdbID} was not found.`
        )
      )
    }
  } catch (error) {
    next(error)
  }
})

movies.post(
  "/:imdbID/comments",
  moviePostCommentValidation,
  async (req, res, next) => {
    try {
      const paramsImdbID = req.params.imdbID
      const movies = await readMovies()
      const movie = movies.find((p) => p.imdbID === paramsImdbID)
      if (movie) {
        const errorList = validationResult(req)
        if (errorList.isEmpty()) {
          //create and push new comment to movie comments
          const newComment = { imdbID: uniqid(), ...req.body }
          const movieComments = movie.comments
          movieComments.push(newComment)

          //rewrite the movie with the new comment
          const remainingMovies = movies.filter(
            (p) => p.imdbID !== paramsImdbID
          )
          const updatedMovie = { ...movie, comments: movieComments }
          remainingMovies.push(updatedMovie)
          await writeMovies(remainingMovies)
          res.send("Comment uploaded!")
        } else {
          next(createHttpError(400, { errorList }))
        }
      } else {
        next(
          createHttpError(
            404,
            `Movie with the id: ${paramsImdbID} was not found.`
          )
        )
      }
    } catch (error) {
      next(error)
    }
  }
)

export default movies
