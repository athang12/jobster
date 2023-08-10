const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')




const errorHandlerMiddleware = (err, req, res, next) => {


  const custumError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong please try agiain"
  }

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  if (err.name === "ValidationError") {

    custumError.msg = Object.values(err.errors).map((item) => item.message).join(",")

    custumError.statusCode = StatusCodes.BAD_REQUEST

  }
  


  if (err.code && err.code === 11000) {
    custumError.statusCode = StatusCodes.BAD_REQUEST
    custumError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field,please choose another value`
  }
 if(err.name==="CastError")
 {
  custumError.msg=`No item found with id: ${err.value}`
  custumError.statusCode=StatusCodes.NOT_FOUND
 }





  return res.status(custumError.statusCode).json({msg:custumError.msg })





  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
}

module.exports = errorHandlerMiddleware
