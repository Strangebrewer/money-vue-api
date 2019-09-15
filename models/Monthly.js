import Transaction from './Transaction';
import TransactionSchema from './TransactionSchema';
import { addTransactions } from '../lib/ControllerHelpers';
const transaction_model = new Transaction(TransactionSchema);

class Monthly {
   constructor(schema) {
      if (!schema || typeof schema !== 'function')
         throw new Error('A valid schema must be given to use this model');
      this.Monthly = schema;
   }

   async find(req_params, user_id) {
      const where = { user: user_id };
      if (req_params.id) where._id = req_params.id;
      
      const response = await this.Monthly.find(where);

      const transactions_month = await transaction_model.transactionsThisMonth(user_id);
      const monthlies = addTransactions(response, 'monthly', transactions_month);

      return monthlies;
   }
}

export default Monthly;