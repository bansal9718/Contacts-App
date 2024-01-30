const express = require("express");
const router = express.Router();

const userController = require("../controllers/user_controller");
const spamController = require("../controllers/spam_controller");
const auth = require("../middlewares/auth");

router.route("/data").get(auth.verifyJWT, userController.getAll);
router.route("/name").get(auth.verifyJWT, userController.getByName);
router.route("/number").get(auth.verifyJWT, userController.getByNumber);
router.route("/search").get(auth.verifyJWT, userController.search);
router.route("/register").post(userController.registerUser);
router.route("/login").post(userController.loginUser);
router.route("/logout").post(auth.verifyJWT, userController.logout);
router.route("/report-spam").post(auth.verifyJWT, spamController.reportSpam);

module.exports = router;
