import express from 'express';
const router = express.Router();
import isAuthenticated from '../policies/isAuthenticated';
import BaseController from '../controllers/BaseController';

router.route('/')
   .get(isAuthenticated, BaseController.index)
   .post(isAuthenticated, BaseController.post)

router.route('/:id')
   .get(isAuthenticated, BaseController.index)
   .put(isAuthenticated, BaseController.put)
   .delete(isAuthenticated, BaseController.delete)

export default router;