const { Category, Product } = require("@models");
const { uploadImage, deleteImage, envPath } = require("@services/upload");

exports.addCategory = async (req, res) => {
  const { image } = req.files;
  try {
    const category = await Category.create(req.body);
    if (image) {
      const bucketPath = envPath("/images/categories");
      const { secure_url, public_id } = await uploadImage(
        image.path,
        bucketPath
      );
      category.image = {
        path: public_id,
        url: secure_url,
      };
      await category.save();
    }
    return res.status(200).send(category);
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
};
exports.updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { image } = req.files;
  try {
    const category = await Category.findOneAndUpdate(
      { _id: categoryId },
      req.body,
      { new: true }
    ).exec();
    if (image) {
      if (category?.image?.path) {
        await deleteImage(category.image.path);
      }
      const bucketPath = envPath("/images/categories");
      const { secure_url, public_id } = await uploadImage(
        image.path,
        bucketPath
      );
      category.image = {
        path: public_id,
        url: secure_url,
      };
      await category.save();
    }
    return res.status(200).send(category);
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
};
exports.deleteCategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const category = await Category.findById(categoryId).exec();
    if (!category) return res.status(404).send();
    if(category?.image?.path){
      await deleteImage(category.image.path);
    }
    await Category.findByIdAndDelete(categoryId).exec();
    await Product.updateMany({}, { $pull: { categories: categoryId } }).exec();
    return res.status(200).send({ categoryId: category._id, message: "categorie supprimée"});
  } catch (error) {
    return res.status(500).send();
  }
};

exports.deleteManyCategories = async (req, res) => {
  const {categoryListDeleted} = req.body;
  console.log("categoryListDeleted ", categoryListDeleted);
  try {
    let idsList;
    let imagesPathList;
    if(Array.isArray(categoryListDeleted) && categoryListDeleted.length){
      idsList = categoryListDeleted.map(p => p.id)
      imagesPathList = categoryListDeleted.flatMap(p => p.image?.path);
      console.log("idsList ", idsList);
      console.log("categimagesPathListoryListDeleted ", imagesPathList);
      await Category.deleteMany({_id:{$in:idsList}}).exec();
      await Product.updateMany({}, { $pullAll: { categories: idsList } }).exec();
      for(const imgPath  of imagesPathList){
        if(imgPath){
          await deleteImage(imgPath );
        }
      }
    }
    return res.status(200).send(idsList);
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
};

exports.getCategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const result = await Category.findById(categoryId).exec();
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send();
  }
};

exports.getCategories = async (req, res) => {
  try {
    const result = await Category.find().exec();
    return res.status(200).send(result);
  } catch (e) {
    // console.log(e);
    return res.status(500).send();
  }
};
