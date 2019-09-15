import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
   name: { type: String, required: true },
   type: { type: String, required: true, default: 'holdings', enum: ['debt', 'holdings'] },
   description: String,
   balance: { type: Number, required: true },
   status: { type: String, required: true, default: 'active', enum: ['active', 'canceled'] },
   user: { type: Schema.Types.ObjectId, ref: 'User'},
}, { timestamps: true });


export default mongoose.model('Account', AccountSchema);
