import 'dotenv/config';
import '../connection';
import bcrypt from 'bcryptjs';
import UserSchema from '../models/UserSchema';
import TransactionSchema from '../models/TransactionSchema';
import AccountSchema from '../models/AccountSchema';
import MonthlySchema from '../models/MonthlySchema';
import CategorySchema from '../models/CategorySchema';

import user_seed from './users.json';
import account_seed from './accounts.json';
import category_seed from './categories.json';
import monthly_seed from './monthlies.json';
// import transaction_seed from './transactions.json';
import transaction_seed from './transactions_two.json';

const pw = bcrypt.hashSync('1234', bcrypt.genSaltSync(10), null);

async function seedDb() {
   try {
      await TransactionSchema.deleteMany({});
      await AccountSchema.deleteMany({});
      await MonthlySchema.deleteMany({});
      await CategorySchema.deleteMany({});
      await UserSchema.deleteMany({});
      return;

      user_seed.forEach(user => {
         user.password = pw;
      });

      const users = await UserSchema.insertMany(user_seed);
      account_seed.forEach(account => {
         account.user = users[0]._id;
      });
      category_seed.forEach(category => {
         category.user = users[0]._id;
      });
      monthly_seed.forEach(monthly => {
         monthly.user = users[0]._id;
      });

      const accounts = await AccountSchema.insertMany(account_seed);
      for (let i = 0; i < accounts.length; i++) {
         const element = accounts[i];
         await UserSchema.findByIdAndUpdate(users[0]._id, {
            $push: { accounts: element._id }
         })
      }

      const categories = await CategorySchema.insertMany(category_seed);
      for (let i = 0; i < categories.length; i++) {
         const element = categories[i];
         await UserSchema.findByIdAndUpdate(users[0]._id, {
            $push: { categories: element._id }
         })
      }

      const monthlies = await MonthlySchema.insertMany(monthly_seed);
      for (let i = 0; i < monthlies.length; i++) {
         const element = monthlies[i];
         await UserSchema.findByIdAndUpdate(users[0]._id, {
            $push: { monthlies: element._id }
         })
      }

      function addAccountToTransaction(index, start, seed) {
         for (let i = start; i < seed.length; i += 4) {
            if (i >= seed.length) return;
            const element = seed[i];
            element.account = accounts[index]._id;
         }
      }

      function addCategoryToTransaction(index, start, increment, seed) {
         for (let i = start; i < seed.length; i += increment) {
            if (i >= seed.length) return;
            const element = seed[i];
            element.category = categories[index]._id;
         }
      }

      function addMonthlyToTransaction(index, start, amount, seed) {
         for (let i = start; i < seed.length; i += 87) {
            if (i >= seed.length) return;
            const element = seed[i];
            element.monthly = monthlies[index]._id;
            element.amount = amount;
            element.type = 'expense'
         }
      }

      addAccountToTransaction(4, 1, transaction_seed);
      addAccountToTransaction(3, 2, transaction_seed);
      addAccountToTransaction(0, 3, transaction_seed);
      addAccountToTransaction(5, 0, transaction_seed);

      addCategoryToTransaction(0, 0, 11, transaction_seed);
      addCategoryToTransaction(1, 1, 6, transaction_seed);
      addCategoryToTransaction(3, 5, 33, transaction_seed);
      addCategoryToTransaction(2, 2, 23, transaction_seed);
      
      addMonthlyToTransaction(0, 3, 109000, transaction_seed);
      addMonthlyToTransaction(1, 2, 6695, transaction_seed);
      addMonthlyToTransaction(2, 5, 5500, transaction_seed);
      addMonthlyToTransaction(3, 7, 5500, transaction_seed);
      addMonthlyToTransaction(4, 8, 12099, transaction_seed);
      addMonthlyToTransaction(5, 11, 11600, transaction_seed);
      addMonthlyToTransaction(6, 2, 18787, transaction_seed);
      addMonthlyToTransaction(7, 3, 34000, transaction_seed);
      addMonthlyToTransaction(8, 6, 27500, transaction_seed);
      addMonthlyToTransaction(9, 22, 30000, transaction_seed);
      addMonthlyToTransaction(10, 12, 2500, transaction_seed);
      addMonthlyToTransaction(11, 15, 35000, transaction_seed);

      for (let i = 0; i < transaction_seed.length; i += 43) {
         if (i >= transaction_seed.length) return;
         const element = transaction_seed[i];
         element.account = accounts[3]._id
         element.amount = 366734;
         element.type = 'payment'
      }

      for (let i = 0; i < transaction_seed.length; i++) {
         const element = transaction_seed[i];
         element.user = users[0]._id
      }

      const transactions = await TransactionSchema.insertMany(transaction_seed);
      
      console.log("***********Aaaaaand, here's your insert counts:*************");
      console.log(users.length + " user records inserted!");
      console.log(accounts.length + " account records inserted!");
      console.log(categories.length + " category records inserted!");
      console.log(monthlies.length + " monthly records inserted!");
      console.log(transactions.length + " transaction records inserted!");
      process.exit(0);

   } catch (e) {
      console.log('error in dbSeed:::', e);
      process.exit(1);
   }
}

seedDb();
