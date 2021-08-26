import bcrypt from 'bcryptjs'
import {validationResult} from 'express-validator'
import db from '../../db/models'
import {generateJWTToken} from '../helpers/authTools'

const authController = {
  signUp: (req, res) => {
    const {name, email, password} = req.body
    // retrieve error message from req
    const errors = validationResult(req)
    // validation failed
    if (!errors.isEmpty()) {
      const extractedErrors = []
      errors.array().map(err => extractedErrors.push({[err.param]: err.msg}))
      return res.status(422).send({
        message: extractedErrors
      })
    }
    // validation passed
    db.User.findOne({where: {email: email}})
      .then(async (user) => {
        if (user) {
          res.send({message: 'User already exists'})
        } else {
          try {
            // create hashed password
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(password, salt)

            // create new user
            const newUser = await db.User.create({
              name,
              email,
              password: hash
            })
            return res.status(201).send({data: newUser, message: 'User successfully created'})
          } catch (error) {
            return res.status(422).send({message: 'Unable to create user'})
          }
        }
      })
  },
  login: (req, res) => {
    const {email, password} = req.body
    // retrieve error message from req
    const errors = validationResult(req)
    // validation failed
    if (!errors.isEmpty()) {
      const extractedErrors = []
      errors.array().map(err => extractedErrors.push({[err.param]: err.msg}))
      return res.status(422).send({
        message: extractedErrors
      })
    }
    db.User.findOne({where: {email: email}})
      .then(async (user) => {
        if (user) {
          try {
            const isEqual = await bcrypt.compare(password, user.password)
            if(isEqual) {
              const token = generateJWTToken({id: user.id, email: user.email})

              return res.status(200).send({
                token,
                userDetail: {
                  email: user.email,
                  id: user.id
                }
              })
            } else {
              return res.status(422).send({message: 'Unable to process your request'})
            }
          } catch(error){
            return res.status(422).send({
              message: 'Unable to process your request'
            })
          }
        }else {
          return res.status(422).send({message: 'Unable to process your request'})
        }

      })
  }
}

export default authController
