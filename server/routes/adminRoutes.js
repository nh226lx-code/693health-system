const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  getOverview,
  getUsers,
  getRecords,
  deleteRecord
} = require("../controllers/adminController");

router.get("/overview", authMiddleware, adminMiddleware, getOverview);
router.get("/users", authMiddleware, adminMiddleware, getUsers);
router.get("/records", authMiddleware, adminMiddleware, getRecords);
router.delete("/records/:id", authMiddleware, adminMiddleware, deleteRecord);

module.exports = router;