//const User = require('../database/models/user')
const db = require('../database/db')
const { response } = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// show the list of user
const index = (req, res, next) => {
    db.User.find().then(response => {       // return all of the user in the db
        res.json({
            response
        })
    }).catch(error => {
        res.json({
            message: 'an Error occurred'
        })
    })
}

// show single user
const showUser = (req, res, next) => {
    let userID = req.body.userID
    db.User.findById(userID).then(response => {
        res.json({
            response
        })
    }).catch(error => {
        res.json({
            message: 'an Error occurred'
        })
    })
}


// add new user
const addUser = (req, res, next) => {
    let userEmail = req.body.email
    console.log("User Email is", userEmail)
    db.User.find({ email: userEmail }).count()
        .then((count) => {
            console.log("Count is", count)
            if (count > 0) {
                //Route to Login and show error
                console.log('User exists.');
                res.json({
                    doesExist: true
                })
            } else {
                console.log('User does not exist.');


                bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
                    if (err) {
                        res.json({
                            error: err
                        })
                    }
                    let user = new db.User({
                        fullName: req.body.fullName,
                        Id: req.body.Id,
                        bio: req.body.bio,
                        avatar: req.body.avatar,
                        listOfFriends: req.body.listOfFriends,
                        listOfChatRoom: req.body.listOfChatRoom,
                        password: hashedPass,
                        email: req.body.email,
                        numberOfUnRead: req.body.numberOfUnRead

                    })
                    user.save().then(response => {
                        // if is okay return response
                        res.json({
                            message: 'user Added successfully'
                        })
                        // if not return an error
                    }).catch(error => {
                        res.json({
                            message: 'an Error occurred'
                        })
                    })
                })
            }
        });





}


//update a user
const updateUser = (req, res, next) => {
    let userID = req.body.userID

    let updateData = {
        fullName: req.body.fullName,
        Id: req.body.Id,
        bio: req.body.bio,
        avatar: req.body.avatar,
        listOfFriends: req.body.listOfFriends,
        listOfChatRoom: req.body.listOfChatRoom,
        email: req.body.email,
        password: req.body.password,
        numberOfUnRead: req.body.numberOfUnRead,
        gender: req.body.gender
    }

    db.User.findByIdAndUpdate(userID, { $set: updateData })
        .then(() => {
            res.json({
                message: 'user updated successfully'
            })
        }).catch(error => {
            res.json({
                message: 'an Error occurred'
            })
        })
}

// delete a user

const deleteUser = (req, res, next) => {
    let userID = req.body.userID

    db.User.findByIdAndDelete(userID)
        .then(() => {
            res.json({
                message: 'user deleted successfully'
            })
        }).catch(error => {
            res.json({
                message: 'an Error occurred'
            })
        })
}


module.exports = {
    index, updateUser, showUser, deleteUser,
    addUser
}