export function addTransactions(array, type, transactions_this_month, transactions_30_days) {
   const formatted_array = [];
   for (let i = 0; i < array.length; i++) {
      const element = { ...array[i]._doc };
      
      const this_month = transactions_this_month.filter(item => element._id.equals(item[type]));
      element.this_month = this_month;

      let thirty_days;
      if (transactions_30_days) {
         thirty_days = transactions_30_days.filter(item => element._id.equals(item[type]));
         element.thirty_days = thirty_days;
      }

      if (type === 'category') {
         element.month_total = balanceReducer(this_month);
         if (transactions_30_days)
            element.thirty_total = balanceReducer(thirty_days);
      }

      formatted_array.push(element);
   }

   return formatted_array;
}

function balanceReducer(transactions) {
   if (transactions)
      return transactions.reduce((total, item) => total + item.amount, 0)
}