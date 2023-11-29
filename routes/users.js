const router = require("express").Router();
const {createUser, getAllUsers, getUser, updateInfo, updateAvatar} = require("../controllers/users");

router.post("/", createUser);
router.get("/", getAllUsers);
router.patch("/me", updateInfo);
router.patch("/me/avatar", updateAvatar);
router.get("/:userId", getUser);

module.exports = router;
