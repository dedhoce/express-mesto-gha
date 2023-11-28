const router = require("express").Router();
const {createUser, getAllUsers, getUser, updateUserData} = require("../controllers/users");

router.post("/", createUser);
router.get("/", getAllUsers);
router.patch("/me", updateUserData);
router.patch("/me/avatar", updateUserData);
router.get("/:userId", getUser);

module.exports = router;
