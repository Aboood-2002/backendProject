const express = require("express");

const router = express.Router();

const {createChat, getAllChats, addConversation, getConversation, deleteChat} = require("../controllers/chatController");

const {protect} = require("../middlewares/authMiddleware");


router.route("/")
      .post(protect,createChat)
      .get(protect,getAllChats)

router.route("/:id")
      .post(protect,addConversation)
      .get(protect,getConversation)
      .delete(protect,deleteChat)





module.exports = router