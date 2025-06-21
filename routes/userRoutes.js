const router = require("express").Router()

const { getAllUsers, getUser, updateUser, profilePhotoUpload,getCountUsersCtrl } = require("../controllers/usersController.js")
const {protect,restrictToAdminInstructor,restrictToSelf} = require("../middlewares/authMiddleware.js")
const validateObjectId = require("../middlewares/validateObjectId")
const {photoUpload} = require("../middlewares/filesUploader.js")


router.route("/profile").get(protect,restrictToAdminInstructor,getAllUsers)


router.route("/profile/:id")
      .get(validateObjectId,getUser)
      .put(validateObjectId,protect,restrictToSelf,updateUser)
     // .delete(validateObjectId,restrictToSelf,deleteUserProfileCtrl)



router.route("/profile/profile-photo-upload")
      .post(protect,photoUpload.single("image"),profilePhotoUpload)


router.route("/count").get(restrictToAdminInstructor,getCountUsersCtrl)




module.exports = router