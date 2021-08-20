import fs from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"

const { readJSON, writeJSON, writeFile, remove, createReadStream } = fs

const moviesJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../data/movies.json"
)
const moviesPostersFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../public/img/movies"
)
const moviesJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../data/movies.json"
)
export const moviesFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../public/img/movies"
)

// *************** movies ****************
export const readMovies = () => readJSON(moviesJSONPath)
export const getmoviesReadableStream = () => createReadStream(moviesJSONPath)
export const writeMovies = (content) => writeJSON(moviesJSONPath, content)

// Posters
export const savePosterCloudinary = new CloudinaryStorage({
  cloudinary,
  params: {
    format: "png",
    folder: "*********i don't know from where to get it********",
  },
}) // cloudinary method

export const savePoster = (fileName, content) =>
  writeFile(join(moviesPostersFolderPath, fileName), content)
export const removePoster = (fileName) =>
  remove(join(moviesPostersFolderPath, fileName)) // fs-methods
