const { Material } = require("@models");

exports.getMaterials = async (req, res) => {
  try {
    const material = await Material.find().exec();
    return res.status(200).send(material);
  } catch (e) {
    console.log(e);
    return res.status(500).send();
  }
};

exports.getMaterial = async (req, res) => {
  try {
    // get user in the url
    const { materialId } = req.params;

    const foundMaterial = await Material.findOne({ _id: materialId }).exec();

    if (!foundMaterial) {
      return res.status(404).send("material not found");
    }
    return res.status(200).send(foundMaterial);
  } catch (error) {
    console.log(error);
    return res.status(500).send("");
  }
};

exports.createMaterial = async (req, res) => {
  const { name, description } = req.body;
  try {
    if (!name || !description) {
      res.status(400).json({ msg: "missing data" });
      return;
    }

    const material = await Material.create(req.body);

    return res.status(201).send(material);
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
};

exports.updateMaterial = async (req, res) => {
  const { materialId } = req.params;

  try {

    console.log(materialId);
  
    const updatedMaterial = await Material.findOneAndUpdate(
      { _id: materialId },
      req.body,
      { new: true }
    ).exec();

    return res.status(200).send(updatedMaterial);
  } catch (error) {
    return res.status(500).send();
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;

    const deletedMaterial = await Material.findOneAndDelete({
      _id: materialId,
    }).exec();

    if (!deletedMaterial) {
      return res.status(404).send("Material not found");
    }

    return res.status(200).send(deletedMaterial);
  } catch (error) {
    console.error(error);
    return res.status(500).send("");
  }
};

exports.deleteManyMaterials = async (req, res) => {
  const { materialListDeleted } = req.body;
  console.log("materialListDeleted ", materialListDeleted);
  try {
    let idsList;
    if (Array.isArray(materialListDeleted) && materialListDeleted.length) {
      idsList = materialListDeleted.map(p => p.id);
      console.log("idsList ", idsList);
      await Material.deleteMany({ _id: { $in: idsList } }).exec();
    }
    return res.status(200).send(idsList);
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
};

