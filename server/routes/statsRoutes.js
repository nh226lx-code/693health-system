const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { summary } = require("../controllers/statsController");

router.get("/summary", auth, summary);

module.exports = router;