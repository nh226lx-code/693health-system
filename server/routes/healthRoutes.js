const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  addRecord,
  getRecords,
  deleteRecord
} = require("../controllers/healthController");

router.post("/", auth, addRecord);
router.get("/", auth, getRecords);
router.delete("/:id", auth, deleteRecord);

module.exports = router;