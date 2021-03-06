// dependencies
const express = require('express');
const connect = require('connect-ensure-login');

// models
const User = require('../models/user');
const Story = require('../models/story');
const Emoji = require('../models/emoji');

// const Story = require('../models/story');
// const Comment = require('../models/comment');

const router = express.Router();

// for emojify
const fuzz = require('fuzzball');

// FIXME: may need to get database data here instead
// GET user input from emojify.js
// router.get('/emojifyInput', function(req, res) {
//   // use fuzz on user data
//   res.send(fuzz.ratio("fuzz", "fuzzy"));
// })

// router.get('/comment', function(req, res) {
//   Comment.find({ parent: req.query.parent }, function(err, comments) {
//     res.send(comments);
//   })
// });

// api endpoints
router.get('/whoami', function(req, res) {
  if(req.isAuthenticated()){
    res.send(req.user);
  }
  else{
    res.send({});
  }
});

router.get('/user', function(req, res) {
  User.findOne({ _id: req.query._id }, function(err, user) {
    res.send(user);
  });
});

router.get('/stories', function(req, res) {
  Story.find({}, function(err, stories) {
    res.send(stories);
  });
});

router.get('/search', function(req, res) {
  //console.log(req.query.topic);
  Story.find({$or:[{tags:{$regex: new RegExp(req.query.topic, "i")}},{content:{$regex: new RegExp(req.query.topic, "i")}}]}, function(err, stories) {
    res.send(stories);
  });
});

//FIXME 
router.get('/emoji', function(req, res) {
  Emoji.find({}, function(err, emojis) {
    res.send(emojis);
  });
});

// router.get('/stories', function(req, res) {
//   Story.find({}, function(err, stories) {
//     res.send(stories);
//   });
// });

// router.post(
//   '/story',
//   connect.ensureLoggedIn(),
//   function(req, res) {
//     User.findOne({ _id: req.user._id },function(err,user) {
//       const newStory = new Story({
//         'creator_id': user._id,
//         'creator_name': user.name,
//         'content': req.body.content,
//       });

//       user.set({ last_post: req.body.content });
//       user.save(); // this is OK, because the following lines of code are not reliant on the state of user, so we don't have to shove them in a callback. 

//       newStory.save(function(err,story) {
//         // configure socketio
//         if (err) console.log(err);
//       });

router.post(
  '/story',
  connect.ensureLoggedIn(),
  function(req, res) {
    User.findOne({ _id: req.user._id },function(err,user) {
      const newStory = new Story({
        'userid': user._id,
        'username': user.name,
        'content': req.body.content,
        'timestamp': req.body.timestamp,
        'tags': req.body.tags,
      });
      //user.set({ last_post: req.body.content });
      user.save(); // this is OK, because the following lines of code are not reliant on the state of user, so we don't have to shove them in a callback. 
      newStory.save(function(err,story) {
        // configure socketio
        if (err) console.log(err);
      });
      res.send({});
    });
  }
);

// router.get('/comment', function(req, res) {
//   Comment.find({ parent: req.query.parent }, function(err, comments) {
//     res.send(comments);
//   })
// });

// router.post(
//   '/comment',
//   connect.ensureLoggedIn(),
//   function(req, res) {
//     User.findOne({ _id: req.user._id }, function (err, user) {
//       const newComment = new Comment({
//         'creator_id': user._id,
//         'creator_name': user.name,
//         'parent': req.body.parent,
//         'content': req.body.content,
//       });

//       newComment.save(function(err, comment) {
//         if (err) console.log(err);
//       });

//       res.send({});
//     });
//   }
// );
module.exports = router;
