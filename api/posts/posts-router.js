// implement your posts router here
const express = require('express')

const Posts = require('./posts-model')

const router = express.Router()


router.get('/api/posts', (req, res) => {
    Posts.find(req.query)
        .then(post => {
            res.status(200).json(post)
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ message: "The posts information could not be retrieved" })
        })
})

router.get('/api/posts/:id', (req, res) => {
    Posts.findById(req.params.id)
    .then(post => {
        if (post) {
            res.status(200).json(post)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ message: "The post information could not be retrieved" })
    })
})

router.post('/api/posts', (req, res) => {
    const newPost = req.body;
    if(!newPost.title || !newPost.contents) {
        res.status(400).json({ message: "Please provide title and contents for the post" })
    } else {
        Posts.insert(newPost)
        .then(({ id }) => {
            return Posts.findById(id)
        })
        .then((post) => {
            res.status(201).json(post)
            
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ message: "There was an error while saving the post to the database" })
        })
    }
})

router.put('/api/posts/:id', async (req, res) => {
    const changes = req.body
    const { id } = req.params
    try {
        const possiblePost = await Posts.findById(req.params.id)
        if (!possiblePost) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else if (!changes.title || !changes.contents) {
        res.status(400).json({ message: "Please provide title and contents for the post" })
    } else {
        const result = await Posts.update(id, changes)
        res.status(200).json(result)
        console.log(id)
        
    }
        } catch (err) {
    res.status(500).json({ message: "The post information could not be modified" })
}
})

router.delete('/api/posts/:id', async (req, res) => {
    try {
    const post = await Posts.findById(req.params.id)
            if(!post) {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            } else {
                await Posts.remove(req.params.id)
                res.status(200).json(post)
            }
        }
    
        catch(error) {
            res.status(500).json({ message: "The comments information could not be retrieved" })
        }
})

router.get('/api/posts/:id/comments', async (req, res) => {
   try {
    const userPost = await Posts.findById(req.params.id)
    if (!userPost) {
        res.status(404).json({ message: "The post with the specified ID does not exist" })
    } else {
        const messages = await Posts.findPostComments(req.params.id)
            res.status(200).json(messages)
        }
    }
        catch(error) {
            console.log(error)
            res.status(500).json({ message: "The comments information could not be retrieved" })
        }
    })


module.exports = router