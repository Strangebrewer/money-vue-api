import Transaction from './Transaction';
import TransactionSchema from './TransactionSchema';
import { addTransactions } from '../lib/ControllerHelpers';
const transaction_model = new Transaction(TransactionSchema);

class Category {
   constructor(schema) {
      if (!schema || typeof schema !== 'function')
         throw new Error('A valid schema must be given to use this model');

      this.Category = schema;
   }

   async find(req_params, user_id) {
      const where = { user: user_id };
      let populate = '';
      if (req_params.id) {
         where._id = req_params.id;
         populate = 'default_account';
      }
      
      const response = await this.Category.find(where).populate(populate);

      const transactions_month = await transaction_model.transactionsThisMonth(user_id);
      const transactions_30 = await transaction_model.transactionsLast30Days(user_id);
      const transactions_all = await TransactionSchema.find({ category: req_params.id }).sort({ date: -1});
      const categories = addTransactions(response, 'category', transactions_month, transactions_30);
      categories[0].transactions_all = transactions_all;

      return categories;
   }
}

export default Category;