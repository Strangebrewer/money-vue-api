import AccountSchema from '../models/AccountSchema';
import TransactionSchema from '../models/TransactionSchema';
import UserSchema from '../models/UserSchema';

export default {

   async delete(req, res) {
      try {
         await TransactionSchema.deleteMany({ account: req.params.id });
         const updated_user = await UserSchema.findOneAndUpdate({ _id: req.user.id }, {
            $pull: { accounts: req.params.id }
         }, { new: true });
         await AccountSchema.findByIdAndDelete(req.params.id);
         res.json(updated_user);
      } catch (e) {
         console.log(e);
         res.status(500).send({
            error: 'Something went wrong while deleting your account'
         })
      }
   }

}