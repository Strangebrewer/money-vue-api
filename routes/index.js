import express from 'express';
const router = express.Router();

import base_routes from './base';
import user_routes from './users';

router.use('/accounts', addUrlToReqBody, base_routes);
router.use('/categories', addUrlToReqBody, base_routes);
router.use('/monthlies', addUrlToReqBody, base_routes);
router.use('/transactions', addUrlToReqBody, base_routes);
router.use('/users', user_routes);

function addUrlToReqBody(req, res, next) {
   req.body.url = req.baseUrl.replace('/', '');
   next();
}

export default router;