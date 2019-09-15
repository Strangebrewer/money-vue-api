import TransactionSchema from '../models/TransactionSchema';
import Account from '../models/Account';
import AccountSchema from '../models/AccountSchema';
const account_model = new Account(AccountSchema);

export default {

   async post(req, res) {
      try {
         req.body.user = req.user.id;
         console.log('req.body:::', req.body);
         const transaction = await TransactionSchema.create(req.body);
         req.body.transaction_id = transaction._id;
         const account = await account_model.calculateNewBalance(req.body);
         res.send({ account, transaction });
      } catch (e) {
         console.log(e);
         res.status(500).send({
            error: e.message
         })
      }
   },

   async delete(req, res) {
      try {
         const transaction = await TransactionSchema.findByIdAndDelete(req.params.id);
         const account = await account_model.calculatePreviousBalance(transaction);
         res.json(account);
      } catch (e) {
         console.log(e);
         res.status(500).send({
            error: e.message
         })
      }
   }

}