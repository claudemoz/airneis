const router = require("express").Router();
const upload = require("@services/upload");
const { verifyToken, verifyRoles } = require("@middlewares");

router.post("/init-upload-status",verifyToken, verifyRoles(['admin', 'superAdmin']), upload.initUploadStatus);

module.exports = router;
