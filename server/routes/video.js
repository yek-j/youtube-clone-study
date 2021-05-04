const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const { Subscribe } = require("../models/Subscribe");

const { auth } = require("../middleware/auth");
// 업로드 - multer
const multer = require("multer");
const path = require("path");
// 썸네일 - ffmpeg
var ffmpeg = require("fluent-ffmpeg");

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      console.log("mimetype:" + file.mimetype);
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  });

  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname);
  
      if (ext !== '.mp4') {
        console.log('it is not jpg');
        return cb(new Error('only jpg is allowed'), false);
      }
      cb(null, true);
    },
  }).single('file');

//=================================
//             Video
//=================================

router.post("/uploadfiles", (req, res) => {

    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
    })

});

router.post("/uploadVideo", (req, res) => {

  // 영상정보 저장 (mongodb)
  const video = new Video(req.body);

  video.save((err, doc) => {
    if(err) return res.json({ success: false, err });
    res.status(200).json({success: true})
  })

});

router.get("/getVideos", (req, res) => {

  // 비디오를 DB에서 가져와서 클라이언트에 보낸다
  Video.find()
    .populate('writer')
    .exec((err, videos) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({success: true, videos})
    })

});

router.post("/getVideo", (req, res) => {

  Video.findOne({ "_id" : req.body.videoId })
  .populate('writer')
  .exec((err, video) => {
      if(err) return res.status(400).send(err);
      res.status(200).json({ success: true, video })
  })
});


router.post("/thumbnail", (req, res) => {

  // 썸네일 생성하고 비디오 러닝타임도 가져오기
    let filePath ="";
    let fileDuration ="";

    ffmpeg.setFfmpegPath('C:\\Program Files\\ffmpeg\\bin\\ffmpeg.exe');
    // 영상 정보 가져오기
    ffmpeg.ffprobe(req.body.filePath, function(err, metadata){
        console.dir(metadata);
        console.log("filename:" + metadata.format.duration);

        fileDuration = metadata.format.duration;
    })


    // 썸네일 생성
    ffmpeg(req.body.filePath).on('filenames', function(filenames){  // 썸네일 이름생성
  //    console.log("Will generate " + filenames.join(', '));
   //   console.log(filenames)
      filePath = "uploads/thumbnails/" + filenames[0];
    }).on('end', function () { // 썸네일 생성 후
      console.log('Screenshots taken');
      return res.json({ success: true, filePath: filePath, fileDuration: fileDuration });
    }).on('error', function(err){
      console.log(err);
      return res.json({ success: false, err });
    }).screenshot({
      count:3, // 썸네일 파일개수
      folder: 'uploads/thumbnails', // 썸네일 파일 저장 폴더
      size: '320x240',
      filename: 'thumbnail-%b.png'
    });

});

router.post("/getSubscriptionVideos", (req, res) => {

  // 자신의 id를 가지고 구독하는 사람들을 찾는다
  Subscribe.find({userFrom : req.body.userFrom})
    .exec((err, subscribeInfo) => {
      if(err) return res.status(400).send(err);

      
     let subscribedUser = [];
  
      subscribeInfo.map((subscribe, i) => {
        subscribedUser.push(subscribe.userTo);
      })

      // 찾은 사람들의 비디오를 가지고 온다
      Video.find({ writer: { $in: subscribedUser }})
        .populate('writer')
        .exec((err, videos) => {
          if(err) return res.status(400).send(err);
          res.status(200).json({success: true, videos});
        })
    })
  
});

module.exports = router;
