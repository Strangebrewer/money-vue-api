import Account from '../models/Account';
import AccountSchema from '../models/AccountSchema';
import AccountController from './AccountController';

import Category from '../models/Category';
import CategorySchema from '../models/CategorySchema';
import CategoryController from './CategoryController';

import Monthly from '../models/Monthly';
import MonthlySchema from '../models/MonthlySchema';
import MonthlyController from './MonthlyController';

import Transaction from '../models/Transaction';
import TransactionSchema from '../models/TransactionSchema';
import TransactionController from './TransactionController';

import UserSchema from '../models/UserSchema';

const account_model = new Account(AccountSchema);
const category_model = new Category(CategorySchema);
const monthly_model = new Monthly(MonthlySchema);
const transaction_model = new Transaction(TransactionSchema);

export default {

   async index(req, res) {
      try {
         let Model;
         switch (req.body.url) {
            case 'accounts': Model = account_model; break;
            case 'categories': Model = category_model; break;
            case 'monthlies': Model = monthly_model; break;
            default: Model = transaction_model;
         }
         const results = await Model.find(req.params, req.user.id);
         res.json(results);
      } catch (e) {
         console.log(e);
         res.status(500).send({
            error: 'Something went wrong. Please try again.'
         });
      }
   },

   async post(req, res) {
      try {
         const { url, name } = req.body;
         let Schema;
         switch (url) {
            case 'accounts': Schema = AccountSchema; break;
            case 'categories': Schema = CategorySchema; break;
            case 'monthlies': Schema = MonthlySchema; break;
            default:
               return TransactionController.post(req, res);
         }

         const exists = await Schema.findOne({ name: name, user: req.user.id });
         if (exists)
            return res.status(400).send('The item you are attempting to create already exists');

         req.body.user = req.user.id;
         const result = await Schema.create(req.body);
         await UserSchema.findByIdAndUpdate(req.user.id, {
            $push: { [url]: result._id }
         });

         res.json(result)
      } catch (e) {
         console.log(e);
         res.status(500).send({
            error: 'Something went wrong. Please try again.'
         });
      }
   },

   async put(req, res) {
      try {
         let Schema;
         switch (req.body.url) {
            case 'accounts': Schema = AccountSchema; break;
            case 'categories': Schema = CategorySchema; break;
            case 'monthlies': Schema = MonthlySchema; break;
            default: Schema = TransactionSchema;
         }
         const result = await Schema.findByIdAndUpdate(req.params.id, req.body, { new: true });
         res.json(result);
      } catch (e) {
         console.log(e);
         res.status(500).send({
            error: 'Something went wrong. Please try again.'
         });
      }
   },

   async delete(req, res) {
      try {
         const { url } = req.body;
         switch (url) {
            case 'accounts':
               return AccountController.delete(req, res);
            case 'categories':
               return CategoryController.delete(req, res);
            case 'monthlies':
               return MonthlyController.delete(req, res);
            default:
               return TransactionController.delete(req, res);
         }
      } catch (e) {
         console.log(e);
         res.status(500).send({
            error: 'Something went wrong. Please try again.'
         });
      }
   }
}