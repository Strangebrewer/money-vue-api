import dateFns from 'date-fns';

class Transaction {
   constructor(schema) {
      if (!schema || typeof schema !== 'function')
         throw new Error('A valid schema must be given to use this model');
      this.Transaction = schema;
   }

   async find(req_params, user_id) {
      const where = { user: user_id };
      if (req_params.id)
         where._id = req_params.id;
      const transactions = await this.Transaction.find(where)
         .populate('account')
         .populate('category')
         .populate('monthly')
         .populate('source')
         .populate('destination');

      return transactions;
   }

   async getMonthlyTransactions(user_id) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      const transactions = await this.Transaction.find({
         user: user_id,
         monthly: { $ne: null },
         date: { $gte: dateFns.subYears(new Date(), 1) }
      }).populate('monthly').sort({ date: -1 });

      const date = new Date();
      const current_month = date.getUTCMonth();
      const current_year = date.getUTCFullYear();

      const transactions_object = {};
      let control_month = current_month;
      let control_year = current_year;

      for (let i = 0; i < 12; i++) {
         const element = months[control_month];
         const month = transactions
            .filter(trans => (
               new Date(trans.date).getUTCMonth() === control_month
               && new Date(trans.date).getUTCFullYear() === control_year
            ))
            .map(trans => ({
               date: trans.date,
               amount: trans.amount,
               name: trans.monthly.name
            }));

         transactions_object[`${element}_${control_year}`] = month;

         if (control_month === 0) {
            control_month = 11;
            control_year--;
         } else {
            control_month--;
         }
      }

      return transactions_object;
   }

   async transactionsByDateRange(user_id, from_date, to_date) {
      // pass dates in 'Jan 1, 2019' format
      const from = dateFns.subHours(new Date(from_date), 6);
      const to = dateFns.subHours(new Date(to_date), 6);
      return await this.Transaction.find({ date: { $gte: from, $lte: to }, user: user_id }).sort({ date: -1 })
   }

   async transactionsThisMonth(user_id) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const date = new Date();
      const month = months[date.getUTCMonth()];
      const year = date.getUTCFullYear();
      const from = dateFns.subHours(new Date(`${month} 1, ${year}`), 6);
      return await this.Transaction.find({ date: { $gte: from }, user: user_id }).sort({ date: -1 })
   }

   async transactionsLast30Days(user_id) {
      const from = dateFns.subDays(new Date(), 30);
      return await this.Transaction.find({ date: { $gte: from }, user: user_id }).sort({ date: -1 })
   }
}

export default Transaction;