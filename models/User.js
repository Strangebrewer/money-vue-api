import bcrypt from 'bcryptjs';
import { sign } from '../passport';

class User {
   constructor(schema) {
      if (!schema || typeof schema !== 'function')
         throw new Error('A valid schema must be given to use this model');
      this.User = schema;
   }

   async login(req_body) {
      const { username, password } = req_body;

      const response = await this.User.findOne({ username })
         .populate('accounts')
         .populate('monthlies')
         .populate('categories');

      if (!response)
         throw new Error('Username is bonkers, yo.');

      const passwordValid = this.checkPassword(password, response.password);
      if (passwordValid) {
         const { _id, email, first_name, last_name, username, accounts, monthlies, categories } = response;
         const token = sign({ id: _id, username, });
         const user = { _id, email, first_name, last_name, username, accounts, monthlies, categories };
         return { token, user };
      } else {
         throw new Error('Who you tryin\' to fool? That ain\'t yo password!');
      }
   }

   async register(req_body) {
      const { username, email } = req_body;

      this.validateInputs(username, email);
      await this.checkUserAvailable(username, email);

      const password = this.hashPassword(req_body.password);
      req_body.password = password;
      const { _id } = await this.User.create(req_body);

      const token = sign({
         id: _id,
         username,
      });
      const user = { _id, username }

      return { token, user };
   }

   async updateUser(req_body, user_id) {
      if (req_body.username || req_body.email) {
         this.validateInputs(req_body.username, req_body.email);
         await this.checkUserAvailable(req_body.username, req_body.email);
      }

      const response = await this.User.findByIdAndUpdate(user_id, req_body, { new: true });

      const {
         _id, username, email, first_name, last_name,
         accounts, monthlies, categories
      } = response;

      const user = {
         _id, username, email, first_name, last_name,
         accounts, monthlies, categories
      }

      return user;
   }

   async updatePassword(req_body, req_user) {
      const { id, password } = req_user;
      const { current_password, new_password } = req_body;
      const passwordValid = this.checkPassword(current_password, password);

      if (passwordValid) {
         const pw = this.hashPassword(new_password);
         const response = await this.User.findByIdAndUpdate(id, { password: pw });

         const {
            _id, username, email, first_name, last_name,
            accounts, monthlies, categories
         } = response;

         const user = {
            _id, username, email, first_name, last_name,
            accounts, monthlies, categories
         }

         return user;
      } else {
         throw new Error('Current password provided is incorrect.')
      }
   }

   validateInputs(username, email) {
      let email_test;
      email !== undefined
         ? email_test = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email)
         : email_test = true;

      let user_test;
      username !== undefined
         ? user_test = /^[a-zA-Z0-9]+$/.test(username)
         : user_test = true;

      if (!user_test && !email_test)
         throw new Error('username & email invalid')

      if (!email_test)
         throw new Error('email invalid');

      if (!user_test)
         throw new Error('username invalid');

      return true;
   }

   async checkUserAvailable(username, email) {
      const username_check = await this.User.findOne({ username })
      if (username_check)
         throw new Error('username taken');

      const email_check = await this.User.findOne({ email });
      if (email_check)
         throw new Error('email has already been used');

      return true;
   }

   checkPassword(input_password, password) {
      return bcrypt.compareSync(input_password, password);
   }

   hashPassword(plain_text_password) {
      return bcrypt.hashSync(plain_text_password, bcrypt.genSaltSync(10), null);
   }
}

export default User;