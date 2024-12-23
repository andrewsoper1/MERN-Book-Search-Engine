const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
    Query: {
        getSingleUser: async (parent, { id, username }) => {
            const foundUser = await User.findOne({
                $or: [{ _id: id }, { username: username }],
            });
            if (!foundUser) {
                throw new AuthenticationError('Cannot find a user with this id or username!');
            }
            return foundUser;
        }
    },

    Mutation: {
        addUser: async (parent, { username, email, password}) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (parent, { book }, context) => {
            if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $addToSet: { savedBooks: book } },
                { new: true, runValidators: true }
            );
            return updatedUser;
        }
        throw new AuthenticationError('You need to be logged in!');
        },

        deleteBook: async (parent, { bookId }, context) => {
            if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $pull: { savedBooks: { bookId } } },
                { new: true }
            );
            return updatedUser;
        }
        throw new AuthenticationError('You need to be logged in!');
        }  
    }  
};

module.exports = resolvers;