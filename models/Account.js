import Transaction from './Transaction';
import TransactionSchema from './TransactionSchema';
import { addTransactions } from '../lib/ControllerHelpers';
const transaction_model = new Transaction(TransactionSchema);

class Account {
   constructor(schema) {
      if (!schema || typeof schema !== 'function')
         throw new Error('A valid schema must be given to use this model');
         
      this.Account = schema;
   }

   async find(req_params, user_id) {
      const where = { user: user_id };
      if (req_params.id) where._id = req_params.id;

      let accounts = await this.Account.find(where);

      if (req_params.id) {
         const transactions_month = await transaction_model.transactionsThisMonth(user_id);
         const transactions_30 = await transaction_model.transactionsLast30Days(user_id);
         const transactions_all = await TransactionSchema.find({ account: req_params.id }).sort({ date: -1});
         accounts = addTransactions(accounts, 'account', transactions_month, transactions_30);
         accounts[0].transactions_all = transactions_all;
      }

      return accounts;
   }

   async calculateNewBalance(req_body) {
      const account = await this.Account.findById(req_body.account);

      let new_balance;
      if (req_body.type === 'payment') { // if it's a payment...
         if (account.type === 'debt') { // and it's a payment towards a debt (e.g. a credit card)...
            new_balance = account.balance - req_body.amount; // the balance goes down.
         } else {                                            // If it's not a debt, it's holdings...
            new_balance = account.balance + req_body.amount; // and the balance goes up.
         }
      } else { // if it's not a payment, it's an expense.
         if (account.type === 'debt') { // If it's a debt (e.g. Credit Card) as well as an expense (spending),...
            new_balance = account.balance + req_body.amount; // the debt goes up.
         } else {                                            // If it's not a debt, it's holdings...
            new_balance = account.balance - req_body.amount; // and the balance goes down.
         }
      }

      const updated_account = await this.Account.findByIdAndUpdate(
         req_body.account, { balance: new_balance }, { new: true }
      );

      return updated_account;
   }

   async calculatePreviousBalance(transaction) {
      const account = await this.Account.findById(transaction.account);

      let new_balance;
      if (transaction.type === 'payment') { // if you're deleting a payment...
         if (account.type === 'debt') { // and it was a payment towards a debt (e.g. a credit card)...
            new_balance = account.balance + transaction.amount; // the balance goes back up.
         } else {                                            // If the account isn't debt, it's holdings...
            new_balance = account.balance - transaction.amount; // and the balance goes back down.
         }
      } else { // if you're not deleting a payment, you're deleting an expense.
         if (account.type === 'debt') { // If the account is a debt (e.g. Credit Card)...
            new_balance = account.balance - transaction.amount; // the debt goes back down.
         } else {                                            // If it's not a debt, it's holdings...
            new_balance = account.balance + transaction.amount; // and the balance goes back up.
         }
      }

      const updated_account = await this.Account.findByIdAndUpdate(
         account._id, { balance: new_balance }, { new: true }
      );

      return updated_account;
   }
}

export default Account;