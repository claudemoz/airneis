const Contact = require("../models/Contact.model");
// exports.getAllContacts = async (req, res) => {
//   try {
//     const contacts = await Contact.find();
//     res.status(200).json(contacts);
//   } catch (erreur) {
//     console.error("Erreur lors de la récupération des contacts :", erreur);
//     res.status(500).send("Erreur lors de la récupération des contacts");
//   }
// };
exports.addContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    return res.status(200).json(contact);
  } catch (error) {
    console.error("Erreur lors de la création du contact :", error);
    return res.status(500).send("Erreur lors de la création du contact");
  }
};
exports.getAllContacts = async (req, res) => {
  try {
    const contact = await Contact.find();
    return res.status(200).send(contact);
  } catch (e) {
    console.log(e);
    return res.status(500).send();
  }
};

exports.getContact = async (req, res) => {
  const { contactId } = req.params;
  try {
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).send("Contact introuvable");
    }
    res.status(200).json(contact);
  } catch (erreur) {
    console.error("Erreur lors de la récupération du contact :", erreur);
    res.status(500).send("Erreur lors de la récupération du contact");
  }
};

exports.deleteContact = async (req, res) => {
  const { contactId } = req.params;
  try {
    const contactDelete = await Contact.findByIdAndDelete(contactId);
    if (!contactDelete) {
      return res.status(404).send("Contact introuvable");
    }
    res.status(200).send("Contact supprimé avec succès");
  } catch (erreur) {
    console.error("Erreur lors de la suppression du contact :", erreur);
    res.status(500).send("Erreur lors de la suppression du contact");
  }
};
exports.deleteManyContacts = async (req, res) => {
  const { contactListDeleted } = req.body;
  console.log("contactListDeleted ", contactListDeleted);
  try {
    let idsList;
    if (Array.isArray(contactListDeleted) && contactListDeleted.length) {
      idsList = contactListDeleted.map((p) => p.id);
      console.log("idsList ", idsList);
      await Contact.deleteMany({ _id: { $in: idsList } });
    }
    return res.status(200).send(idsList);
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
};
