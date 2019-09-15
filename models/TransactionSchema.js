import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// payments can have a source, and expenses can have a destination
// but they aren't required
// every transaction with a source should be an end to the transaction
// and it should have a corresponding beginning transaction with a destination

// transactions that are payments to holdings (...vs. debt) that don't have sources would be... ding!ding!ding!, INCOME!
// But no need to mark it as such in the db- I'm just making notes so I remember why I do this shizzle.
const TransactionSchema = new Schema({
   account: { type: Schema.Types.ObjectId, ref: 'Account' },
   category: { type: Schema.Types.ObjectId, ref: 'Category' },
   monthly: { type: Schema.Types.ObjectId, ref: 'Monthly' },
   user: { type: Schema.Types.ObjectId, ref: 'User' },
   description: String,
   amount: { type: Number, required: true },
   source: { type: Schema.Types.ObjectId, ref: 'Account' },
   destination: { type: Schema.Types.ObjectId, ref: 'Account' },
   type: {
      type: String,
      required: true,
      default: 'expense',
      enum: ['expense', 'payment']
   },
   date: { type: Date, required: true, default: Date.now() }
}, { timestamps: true });

export default mongoose.model('Transaction', TransactionSchema);