import {validationResult} from 'express-validator'
import db from '../../db/models'
import { convertDate } from '../helpers/date-converter'
import {Op} from 'sequelize'


 const todoController  = {
  
  getAllUserTodos: (req, res) => {
    db.Todo.findAll({
      where: { user_id: req.decoded.id },
      order: [['dueDate', 'DESC']]
    })
    .then(todos => {
      // Filter option for all unique date
      const dateOptions = []
      todos.forEach(todo => {
        // convert date
        const convertedDate = convertDate(todo.dataValues.dueDate)
        // Add unique date to date filter
        if (!dateOptions.includes(convertedDate)) { dateOptions.push(convertedDate) }
        // convert all displayed date
        todo.dataValues.dueDate = convertedDate
      })
      return res.status(200).send({success: true, todos})
    })
    .catch(error => res.status(422).send({message: 'unable to process your request'}))
  },

  getViewOneTodo: (req, res) => {
    db.Todo.findOne({
      where: {
        user_id: req.decoded.id,
        id: req.params.id
      }
    })
      .then(todo => {
        todo.dataValues.dueDate = convertDate(todo.dataValues.dueDate)
        return res.status(200).send({success: true, todo})
      })
      .catch(error => res.status(422).send({message: 'unable to process your request'}))
  },

  getSearch: (req, res) => {
    // retrieve data user selected
    const selectedSort = req.query.sort || req.query.preSort
    const selectedStatus = req.query.doneReset ? null : req.query.done || req.query.preDone
    const selectedDueDate = req.query.dateReset ? null : req.query.date || req.query.preDate
    // get criteria
    const sort = selectedSort === 'Name' ? 'name'
      : selectedSort === 'Status' ? 'done'
        : 'dueDate'
    const status = selectedStatus === 'Done' ? true
      : selectedStatus === 'Undone' ? false
        : ''
    const dueDate = selectedDueDate ? { [Op.eq]: new Date(selectedDueDate) } : { [Op.gte]: new Date('2019-01-01') }

    // Filter option for all unique date
    const dateOptions = []

    db.Todo.findAll({
      attributes: ['dueDate'],
      where: { user_id: req.decoded.id },
      group: ['dueDate'],
      order: [['dueDate', 'DESC']]
      })
      .then(allDate => {
        allDate.forEach(date => dateOptions.push(convertDate(date.dataValues.dueDate)))
        return db.Todo.findAll({
          where: {
            user_id: req.decoded.id,
            done: { [Op.or]: [status][0] === '' ? [true, false] : [status] },
            dueDate
          },
          order: [[sort, 'DESC']]
        })
      })
      .then(todos => {
        // convert all displayed date
        todos.forEach(todo => { todo.dataValues.dueDate = convertDate(todo.dataValues.dueDate) })
        return res.status(200).send({success: true, todos, dateOptions})
      })
      .catch(error => res.status(422).send({message: 'unable to process your request'}))
  },
  postNewTodo: (req, res) => {
    // keep user input
    const { name, status, detail, dueDate } = req.body
    // retrieve error message from express-validator
    const errors = validationResult(req)
    // one or more error messages exist
    if (!errors.isEmpty()) {
      const extractedErrors = []
      errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
      return res.status(422).send({
        message: extractedErrors
      })
    }
    console.log(req.decoded)
    // pass validation
    db.Todo.create({
      name,
      done: req.body.status === 'done',
      detail,
      user_id: req.decoded.id,
      dueDate
    })
      .then(todo => {
          return res.status(201).send({message: "Todo successfully created", todo})
        })
      .catch(error => {
          console.log(WHY)
          return res.status(422).send({message: error.message})
        })
  },

  putEditTodo: (req, res) => {
    // keep user input
    const { id, name, status, detail, dueDate } = req.body
    // retrieve error message from express-validator
    const errors = validationResult(req)
    // one or more error messages exist
    if (!errors.isEmpty()) {
      const extractedErrors = []
      errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
      return res.status(422).send({
        message: extractedErrors
      })
    }
    // pass validation
    db.Todo.findOne({
      where: {
        id: req.params.id,
        user_id: req.decoded.id
      }
    })
      .then(todo => {
        todo.name = name
        todo.done = req.body.status === 'done'
        todo.detail = detail
        todo.dueDate = dueDate
        return todo.save()
      })
      .then(todo => res.status(201).send({message: "Todo successfully updated", todo}))
      .catch(error => res.status(422).send({message: 'unable to process your request'}))
  },
  deleteTodo: (req, res) => {
    db.Todo.destroy({
      where: {
        user_id: req.decoded.id,
        id: req.params.id
      }
    })
      .then(todo => res.status(202).send({message: "Successfuly deleted"}))
      .catch(error => res.status(422).send({message: 'unable to process your request'}))
  }
}

export default todoController
