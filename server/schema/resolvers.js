const {User} = require('../models');
const {AuthenticationError} = require('apollo-server-express');
const {signToken} = require('../utils/auth')


const resolvers = {
    Query:{
    me:async (parent,args,context) => {
        if (context.user) {
            const userData = await User.findOne ({_id: context.user._id})
            .select("-__v -password")
            .populate('books')
            return userData;
        }
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
            try{
            const user = await User.create(args);
            const token = await signToken(user);

            return{token,user};
            } catch(err){
                console.log(err);
            }
        },
        saveBook: async (parent, args, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    {_id: context.user._id},
                    {$push: {savedBooks: args.input}},
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
                    {$pull: {savedBooks: {bookId: bookId}}},
                    {new:true}
                );
                return updatedUser
            }
            throw new AuthenticationError('To proceed you must be logged in!')
        },
    },
};

module.exports = resolvers