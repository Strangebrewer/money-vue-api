import CategorySchema from '../models/CategorySchema';
import TransactionSchema from '../models/TransactionSchema';
import UserSchema from '../models/UserSchema';

export default {

   async delete(req, res) {
      try {
         const category = await CategorySchema.findByIdAndDelete(req.params.id);
         const user = await UserSchema.findByIdAndUpdate(req.user.id, {
            $pull: { categories: category._id }
         }, { new: true });
         await TransactionSchema.updateMany({ category: category._id }, {
            category: null
         });
         res.json(user);
      } catch (e) {
         console.log(e);
         res.status(500).send({
            error: 'Something went wrong while deleting your category'
         })
      }
   }

}