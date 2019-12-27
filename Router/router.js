const express = require('express');

const databass = require('../data/db.js');

const route = express.Router();

route.use(express.json());

//-----------------------------------GET posts
route.get('/', (req, res) => {
    databass.find()
    .then(post => {
        res.status(200).json(post)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: "The posts information could not be retrieved."
        })
    })
})

//-------------------------------------GET posts by id
route.get('/:id', (req, res) => {
    const id = req.params.id

    databass.findById(id)
    .then(postId => {
        if(postId){
            res.status(200).json(postId)
        }else{
            res.status(404).json({
                error: "The post with the specified ID does not exist."
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: "The post information could not be retrieved."
        })
    })
})

//-------------------------------GET posts comments
route.get('/:id/comments', (req, res) => {
    const id = req.params.id

    databass.findPostComments(id)
    .then(comment => {
        if(comment){
            res.status(200).json(comment)
        }else{
            res.status(404).json({
                message: "The post with the specified ID does not exist."
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: "The comments information could not be retrieved." 
        })
    })
})

//----------------------------------- DELETE post
route.delete('/:id', (req, res) => {
    const id = req.params.id;

    databass.remove(id)
    .then(postRemove => {
        if(postRemove){
            res.status(200).json(postRemove)
        }else{
            res.status(404).json({
                message: "The post with the specified ID does not exist." 
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: "The post could not be removed"
        })
    })
})

//-------------------------------- POST a posts
route.post('/', (req, res) => {
    const newData = req.body

    databass.insert(newData)
    .then(newPost => {
        if(!newPost.title && !newPost.contents){
            res.status(201).json(newPost)
        }else{
            res.status(400).json({
                errorMessage: "Please provide title and contents for the post."
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: "There was an error while saving the post to the database"
        })
    })
})

//---------------------------------- POST a comments in a post
route.post('/:id/comments', (req, res) => {
    const newData = req.body;
    const id = req.params.id;

    if(newData){
        databass.insertComment(newData)
        .then(newComment => {
            if(newComment && id){
                res.status(201).json(newComment)
            }else{
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: "There was an error while saving the comment to the database"
            })
        })

    }else{
        res.status(400).json({
            errorMessage: "Please provide text for the comment."
        })
    }
})

//----------------------------------- PUT a post
route.put('/:id', (req, res) => {
    const changeData = req.body
    const id = req.params.id

    if(!changeData.title && !changeData.contents){
        res.status(400).json({
            message: "Please provide title and contents for the post."
        })
    }else{
        databass.update(id, changeData)
        .then(changePost => {
            res.status(200).json(changePost)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: "The post information could not be modified."
            })
        })
    }


})

module.exports = route;