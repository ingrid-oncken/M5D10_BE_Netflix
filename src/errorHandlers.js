export const notFoundErrorHandler = (err, req, res, next) => {
  if (err.status === 404) {
    console.log(err)
    res.status(404).send(err.message)
  } else {
    next(err)
  }
}

export const badRequestErrorHandler = (err, req, res, next) => {
  if (err.status === 400) {
    console.log(err)
    res.status(400).send(err.errorList)
  } else {
    next(err)
  }
}

export const forbiddenErrorHandler = (err, req, res, next) => {
  if (err.status === 403) {
    console.log(err)
    res.status(403).send(err.message)
  } else {
    next(err)
  }
}

export const genericServerErrorHandler = (err, req, res, next) => {
  console.log(err)
  res.status(500).send("Generic server Error, contact support.")
}
