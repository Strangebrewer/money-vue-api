import express from 'express';
const router = express.Router();
import isAuthenticated from '../policies/isAuthenticated';
import * as UserController from '../controllers/UserController';

router.route('/')
   .post(UserController.register)
   .get(isAuthenticated, UserController.getCurrentUser)
   .put(isAuthenticated, UserController.put);

router.post('/login', UserController.login);
router.get('/comprehensive', isAuthenticated, UserController.getAllData);

router.route('/:id')
   .put(isAuthenticated, UserController.updatePassword)
   .delete(isAuthenticated, UserController.remove);

export default router;