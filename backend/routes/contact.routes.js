const router = require("express").Router();
const path = require("path");
const formData = require("express-form-data");
const contactControllers = require("@controllers/contact.controllers");
const { verifyToken, verifyRoles } = require("@middlewares");

router.delete("/delete-contact/:contactId", contactControllers.deleteContact);
router.post("/delete-many-contacts", contactControllers.deleteManyContacts);
router.get("/get-contact/:contactId", contactControllers.getContact);
router.get("/get-contacts", contactControllers.getAllContacts);
router.post("/add-contact", contactControllers.addContact);

module.exports = router;
