const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const User = require('../../schemas/userSchema');
const Post = require('../../schemas/PostSchema');


app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", async (req, res, next) => {
    var results = await getPosts({});
    res.status(200).send(results);
})

router.get("/:id", async (req, res, next) => {

    var postId = req.params.id;

    var postData = await getPosts({ _id: postId });
    postData = postData[0];

    var results = {
        postData: postData
    }

    if(postData.replyTo !== undefined) {
        results.replyTo = postData.replyTo;
    }

    results.replies = await getPosts({ replyTo: postId });

    res.status(200).send(results);
})


router.post("/", async(req,res ,next)=>{  

    if(!req.body.content){
        console.log("Content parameter not send with request");
       return res.sendStatus(400);
    }

    var postData = {
        content: req.body.content,
        postedBy : req.session.user
    }

if(req.body.replyTo){
    postData.replyTo = req.body.replyTo;
}

    Post.create(postData)
    .then( async newPost=>{    // all good
         newPost = await User.populate(newPost , {path :"postedBy"})      //posted by right now will have in the data base the all information about the user that posted

        res.status(201).send(newPost);      //201 = created
    })  
    .catch(error=>{    // something when wrong while post the post
        console.log(error);
        res.sendStatus(400);
    })  

})


router.put("/:id/like", async (req, res, next) => {

    var postId = req.params.id;
    var userId = req.session.user._id;

    var isLiked = req.session.user.likes && req.session.user.likes.includes(postId);  //check if the specific user alredy liked to post

    var option = isLiked ? "$pull" : "$addToSet";   //if is already liked so   option = pull(unlike) the post , if it flase option =  add like

    // Insert user like
    req.session.user = await User.findByIdAndUpdate(userId, { [option]: { likes: postId } }, { new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    // Insert post like
    var post = await Post.findByIdAndUpdate(postId, { [option]: { likes: userId } }, { new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })


    res.status(200).send(post)
})

router.post("/:id/retweet", async (req, res, next) => {

    var postId = req.params.id;
    var userId = req.session.user._id;

//Try and delete retweets
var deletedPost = await Post.findOneAndDelete({ postedBy: userId, retweetData: postId })
.catch(error => {
    console.log(error);
    res.sendStatus(400);
})


    var option = deletedPost != null ?  "$pull" : "$addToSet";   //if is already retweeted so option = pull(delete) the post , if it flase option =  retweet
    var repost = deletedPost;

if(repost == null)  // it means there is nothing to delete so we need to create retweet
    {
        repost = await Post.create({ postedBy: userId, retweetData: postId })
        .catch(error => {
            console.log(error);
            res.sendStatus(400);
        })
    }



    // Insert int user collection the all retweets of the user in the retweets array
    req.session.user = await User.findByIdAndUpdate(userId, { [option]: { retweets: repost._id } }, { new: true })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    //in the post collection ( in retweetUsers array) , add the users by userId , who retweeted the post
    var post = await Post.findByIdAndUpdate(postId, { [option]: { retweetUsers: userId } }, { new: true })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })


    res.status(200).send(post)
})

//deleting the post for us
    router.delete("/:id" ,(req , res , next) =>{
        Post.findByIdAndDelete(req.params.id)
        .then(() => res.status(202))
        .catch(error => {
            console.log(error);
            res.sendStatus(400);
        })
    })

//fetch posts from the database, populate certain fields, and return the results
async function getPosts(filter) {
    var results = await Post.find(filter)
    .populate("postedBy")
    .populate("retweetData")
    .populate("replyTo")
    .sort({ "createdAt": -1 })
    .catch(error => console.log(error))

    results = await User.populate(results, { path: "replyTo.postedBy"});
    return await User.populate(results, { path: "retweetData.postedBy"});
}

module.exports = router;