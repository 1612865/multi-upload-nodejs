const express = require('express')
var multer  = require('multer')
const path = require('path')
const uuid = require('uuid/v4');
const port = 3000

var extWhiteList = ['.jpg', '.jpeg', '.png', '.gif', '.pdf']
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        let extname = path.extname(file.originalname).toLowerCase()
        cb(null, `${uuid()}${extname}`)
    }
  })
  
var upload = multer({
    fileFilter: (req, file, cb) => {
        let extname = path.extname(file.originalname).toLowerCase()
        if (extWhiteList.indexOf(extname) > 0)
            cb(null, true)
        else{
            let error = 'File extension is not accepted!'
            req.fileValidationError = error
            cb(null, false)
        }
    },
    storage: storage 
}).array('photos')

var app = express()
app.use(express.static("html"))
app.use('/uploads', express.static("uploads"))

app.post('/upload', function (req, res, next) {
    upload(req, res, function (err) {
        if(req.fileValidationError) {
            res.status(400)
            res.json({"error": req.fileValidationError})
        }
        const files = req.files
        res.send(files)
      })
})

app.listen(port, () => console.log(`App listening on port ${port}!`))
