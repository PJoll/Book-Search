const {User} = require('../models');
const {AuthenticationError} = require('apollo-server-express');
const {signToken} = require('../utils/auth')


const resolvers = {
    Query:{
    me:async (parent,args,context) => {
        if (context.user) {
            const userData = await User.findOne ({_id: context.user._id});
            return userData;
        }
    },

users: async () => {
    return await User.find().select ('__v -password').populate('savedBooks')
},
user: async (parent, { username }) => {
    return await User.findOne({username}).select('__v -password').populate('savedBooks')
},
    },
    Mutation: {
        login: async (parent,{email,password} ) => {
            const user = await User.findOne({email});
            if(!user) {
                throw new AuthenticationError('login email incorrect')
            }
            const realPw = await user.isCorrectPassword(password);
            if(!realPw) {
                throw new AuthenticationError('login password incorrect')
            }
            const token = signToken(user)
            return{token,user};
        },
        addUser: async(parent,args) => {
            const user = await User.create(args);
            const token = await signToken(user);

            return{token,user};
        },
        saveBook: async (parent, {bookData}, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    {_id: context.user._id},
                    {},
                    {new: true, runValidators: true}
                );
                return updatedUser;
            }
            throw new AuthenticationError('you need to be logged in to save')
        },
        removeBook: async(parent, {bookId}, context) => {
            if (context.user){
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$pull: {savedBook: {bookId: bookId}}},
                    {new:true}
                );
                return updatedUser
            }
            throw new AuthenticationError('To proceed you must be logged in!')
        },
    },
};

module.exports = resolvers