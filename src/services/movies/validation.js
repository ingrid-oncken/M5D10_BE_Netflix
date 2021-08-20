import { body } from "express-validator"

export const movieValidation = [
  body("Title").exists().withMessage("Title is a mandatory field!"),
  body("Type").exists().withMessage("Typle is a mandatory field!"),
  body("Poster").exists().withMessage("Poster is a mandatory field!"),
]

export const movieCommentValidation = [
  body("comment").exists().withMessage("Please, leave a comment"),
  body("rate").exists().withMessage("Please, rate the movie from 1 to 5"),
]
