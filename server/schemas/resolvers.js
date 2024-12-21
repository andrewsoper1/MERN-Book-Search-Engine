const { User } = require('../models');

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
        createUser: async (parent, { username, email, password}) => {
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

        saveBook: async (parent, { book }) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $addToSet: { savedBooks: book } },
                { new: true, runValidators: true }
            );
            return updatedUser;
        },

        deleteBook: async (parent, { bookId }) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $pull: { savedBooks: { bookId } } },
                { new: true }
            );
            return updatedUser;
        }
    }    
}

module.exports = resolvers;