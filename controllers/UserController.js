import User from '../models/User';
import UserSchema from '../models/UserSchema';
import Transaction from '../models/Transaction';
import TransactionSchema from '../models/TransactionSchema';
import AccountSchema from '../models/AccountSchema';
import CategorySchema from '../models/CategorySchema';
import MonthlySchema from '../models/MonthlySchema';
import { addTransactions } from '../lib/ControllerHelpers';

const user_model = new User(UserSchema);
const transaction_model = new Transaction(TransactionSchema);

export async function getCurrentUser(req, res) {
   try {
      const user = await UserSchema.findById(req.user._id)
         .populate('accounts')
         .populate('monthlies')
         .populate('categories');

      const { _id, username, email, first_name, last_name } = user;

      const transactions_month = await transaction_model.transactionsThisMonth(req.user._id);
      const transactions_30 = await transaction_model.transactionsLast30Days(req.user._id);

      const accounts = addTransactions(user.accounts, 'account', transactions_month, transactions_30);
      const categories = addTransactions(user.categories, 'category', transactions_month, transactions_30);
      const monthlies = addTransactions(user.monthlies, 'monthly', transactions_month, transactions_30);

      const userData = {
         _id, username, email, first_name, last_name, transactions_30,
         transactions_month, accounts, monthlies, categories,
      }
      res.json(userData);
   } catch (e) {
      console.log(e);
      res.status(500).send({
         error: e.message
      });
   }
}

export async function getAllData(req, res) {
   try {
      const transactions = await transaction_model.getMonthlyTransactions(req.user._id);
      // console.log('transactions:::', transactions);
      res.json(transactions);
   } catch (e) {
      console.log(e);
      res.status(500).send({
         error: e.message
      });
   }
}

export async function register(req, res) {
   try {
      const user = await user_model.register(req.body);
      res.json(user);
   } catch (e) {
      console.log(e);
      res.status(418).send({
         error: e.message
      });
   }
}

export async function login(req, res) {
   try {
      const response = await user_model.login(req.body);
      const { _id, username, email, first_name, last_name } = response.user;

      const transactions_month = await transaction_model.transactionsThisMonth(response.user._id);
      const transactions_30 = await transaction_model.transactionsLast30Days(response.user._id);

      const accounts = addTransactions(response.user.accounts, 'account', transactions_month, transactions_30);
      const categories = addTransactions(response.user.categories, 'category', transactions_month, transactions_30);
      const monthlies = addTransactions(response.user.monthlies, 'monthly', transactions_month, transactions_30);

      const user = {
         _id, username, email, first_name, last_name, transactions_30,
         transactions_month, accounts, monthlies, categories,
      }
      const user_data = { user, token: response.token };

      res.json(user_data);
   } catch (e) {
      console.log(e);
      res.status(418).send({
         error: e.message
      });
   }
}

export async function put(req, res) {
   try {
      const user = await user_model.updateUser(req.body, req.user.id);
      res.json(user);
   } catch (e) {
      console.log(e);
      res.status(500).send({
         error: e.message
      });
   }
}

export async function updatePassword(req, res) {
   try {
      const user = await user_model.updatePassword(req.body, req.user);
      res.json(user);
   } catch (e) {
      console.log(e);
      res.status(500).send({
         error: e.message
      });
   }
}

export async function remove(req, res) {
   try {
      const user = await UserSchema.findByIdAndDelete(req.params.id);

      if (user.accounts.length) {
         user.accounts.forEach(account_id => {
            TransactionSchema.deleteMany({ account: account_id });
         });
         await AccountSchema.deleteMany({ user: user._id });
      }

      if (user.categories.length)
         await CategorySchema.deleteMany({ user: user._id });

      if (user.monthlies.length)
         await MonthlySchema.deleteMany({ user: user._id });

      res.json(user);
   } catch (e) {
      console.log(e);
      res.status(500).send({
         error: e.message
      });
   }
}