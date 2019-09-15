import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const Schema = mongoose.Schema;

const tempPw = bcrypt.hashSync('1234', bcrypt.genSaltSync(10), null);

const UserSchema = new Schema({
   username: { type: String, required: true },
   password: { type: String, required: true, default: tempPw },
   email: String,
   first_name: String,
   last_name: String,
   accounts: [{
      type: Schema.Types.ObjectId,
      ref: 'Account'
   }],
   monthlies: [{
      type: Schema.Types.ObjectId,
      ref: 'Monthly'
   }],
   categories: [{
      type: Schema.Types.ObjectId,
      ref: 'Category'
   }]
}, { timestamps: true });

export default mongoose.model('User', UserSchema);