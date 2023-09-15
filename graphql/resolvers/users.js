const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');
const checkAuth = require('../../util/check-auth');

const {
  validateRegisterInput,
  validateLoginInput
} = require('../../util/validators');
const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
}

module.exports = {
  Query: {
    async searchUsers(_, { query }) {
      try {
        const users = await User.find({ username: new RegExp(query, 'i') });
        return users;
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await User.findOne({ username });

      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Wrong crendetials';
        throw new UserInputError('Wrong crendetials', { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token
      };
    },
    async register(
      _,
      {
        registerInput: { username, email, password, confirmPassword }
      }
    ) {
      // Validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }
      // TODO: Make sure user doesnt already exist
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is taken'
          }
        });
      }
      // hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString()
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token
      };
    },
    async followUser(_, { userId }, context) {
      const authUser = checkAuth(context); // This might return a plain object

      // Retrieve the user from the database to get a Mongoose document
      const user = await User.findById(authUser.id);
      if (!user) {
        throw new Error('Authenticated user not found');
      }
          
      const targetUser = await User.findById(userId);
      if (!targetUser) {
        throw new Error('User not found');
      }
    
      // Initialize followers and following arrays if they don't exist
      if (!targetUser.followers) {
        targetUser.followers = [];
      }
      if (!user.following) {
        user.following = [];
      }
    
      // Check if the user is already followed
      if (targetUser.followers.find((follower) => follower.toString() === user.id)) {
        // Unfollow the user
        targetUser.followers = targetUser.followers.filter((follower) => follower.toString() !== user.id);
        user.following = user.following.filter((following) => following.toString() !== userId);
      } else {
        // Follow the user
        targetUser.followers.push(user.id);
        user.following.push(userId);
      }
    
      await targetUser.save();
      await user.save();
    
      return targetUser;
    },
    
  }
};
