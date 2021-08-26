/* eslint-disable babel/new-cap */
import express from 'express'

import todoController from '../controllers/todo'
import validation from '../middlewares/express-validator'
import permissions from '../middlewares/permissions'


const todoRouter = express.Router()

todoRouter.route('/')
  .get(permissions.isAuthenticated, todoController.getAllUserTodos)
todoRouter.route('/search')
  .get(permissions.isAuthenticated, todoController.getSearch)
todoRouter.route('/view/:id')
  .get(permissions.isAuthenticated, todoController.getViewOneTodo)
todoRouter.route('/new')
  .post(permissions.isAuthenticated, validation.newTodo, todoController.postNewTodo)
todoRouter.route('/edit/:id')
  .put(validation.editTodo, permissions.isAuthenticated, todoController.putEditTodo)
todoRouter.route('/delete/:id')
  .delete(permissions.isAuthenticated, todoController.deleteTodo)


export default todoRouter
