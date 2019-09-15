import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const MonthlySchema = new Schema({
   name: { type: String, required: true },
   description: String,
   amount: { type: Number, required: true },
   user: { type: Schema.Types.ObjectId, ref: 'User' },
   due_date: { type: Number, required: true },
   default_account: { type: Schema.Types.ObjectId, ref: 'Account' },
   destination: { type: Schema.Types.ObjectId, ref: 'Account' }
}, { timestamps: true });

export default mongoose.model('Monthly', MonthlySchema);