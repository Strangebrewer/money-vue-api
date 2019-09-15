import MonthlySchema from '../models/MonthlySchema';
import UserSchema from '../models/UserSchema';
import TransactionSchema from '../models/TransactionSchema';

export default {

   async delete(req, res) {
      try {
         const response = await MonthlySchema.findByIdAndDelete(req.params.id);
         const monthly = response._id
         const user = await UserSchema.findByIdAndUpdate(req.user.id, {
            $pull: { monthlies: monthly }
         }, { new: true });
         await TransactionSchema.updateMany({ monthly }, { monthly: null });
         res.json(user);
      } catch (e) {
         console.log(e);
         res.status(500).send({
            error: 'Something went wrong while deleting your monthly expense'
         })
      }
   }

}