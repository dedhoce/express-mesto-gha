const router = require("express").Router();
const {createUser, getAllUsers, updateUserInfo, updateUserAvatar, getUser} = require("../controllers/users");

router.post("/", createUser);
router.get("/", getAllUsers);
router.patch("/me", updateUserInfo);
router.patch("/me/avatar", updateUserAvatar);
router.get("/:userId", getUser);

module.exports = router;
