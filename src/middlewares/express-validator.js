import { body } from 'express-validator'

const validation = {
  newTodo: [
    // validate name field
    body('name')
      .isLength({ min: 1, max: 10 })
      .withMessage('Name is required, max 10 letters'),
    // check status field
    body('status')
      .custom(value => {
        if (value !== 'done' && value !== 'notDone') {
          throw new Error('Please choose a task status')
        }
        // if status passed validation
        return true
      }),
    // check detail field
    body('detail')
      .isLength({ max: 60 })
      .withMessage('Detail length must be less than 60 words')
  ],
  editTodo: [
    // validate name field
    body('name')
      .isLength({ min: 1, max: 10 })
      .withMessage('Name is required, max 10 letters'),
    // check status field
    body('status')
      .custom(value => {
        if (value !== 'done' && value !== 'notDone') {
          throw new Error('Please choose a task status')
        }
        // if status passed validation
        return true
      }),
    // check detail field
    body('detail')
      .isLength({ max: 60 })
      .withMessage('Detail length must be less than 60 words')
  ],
  signUp: [
    body('name')
      .isLength({ min: 1, max: 10 })
      .withMessage('Name is required, max 10 letters'),
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .custom(value => {
        const regex = /^\S{8,12}$/
        const result = value.match(regex)
        if (!result) {
          throw new Error('Password length must be between 8-12')
        }
        return true
      })
  ],
  login: [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .custom(value => {
        const regex = /^\S{8,12}$/
        const result = value.match(regex)
        if (!result) {
          throw new Error('Password length must be between 8-12')
        }
        return true
    })
  ]
}

export default validation
