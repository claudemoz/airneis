const { Product, Category } = require("@models");
const { uploadImage, deleteImage, envPath } = require("@services/upload");

exports.addProduct = async (req, res) => {
  // console.log("req.body ", req.body);
  // console.log("req.files ", req.files);
  try {
    const product = await Product.create({
      ...req.body,
      materials: JSON.parse(req.body.materials),
      categories: JSON.parse(req.body.categories)
    });
    if (req.files) {
      const bucketPath = envPath("/images/products");
      if (Array.isArray(req.files.images)) {
        const files = req.files.images;
        for (const [index, file] of files.entries()) {
          const { secure_url, public_id } = await uploadImage(
            file.path,
            bucketPath
          );
          product.images.push({
            index: index,
            path: public_id,
            url: secure_url,
          });
        }
      } else {
        const { secure_url, public_id } = await uploadImage(
          req.files.images.path,
          bucketPath
        );
        product.images.push({
          index: 0,
          path: public_id,
          url: secure_url,
        });
      }
      await product.save();
    }
    return res.status(200).send(product);
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
};
exports.updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { imgRemovedList,...updatedData} = req.body
  try {
    if(imgRemovedList){
      for(const img of JSON.parse(imgRemovedList)){
        await deleteImage(img.path);
        const product = await Product.findOneAndUpdate({ _id: productId },{
          $pull: {
            images: {_id: img.id},
          }
        },{ new: true }).exec();

        if (product) {
          const firstIndex = product.images.length > 0 ? product.images[0].index : 0;
          for (let i = 0; i < product.images.length; i++) {
            const newIndex = firstIndex + i;
            product.images[i].index = newIndex;
          }
          await product.save();
        }
      }
    }
    
    if (req.files && req.files.images) {
      const bucketPath = envPath("/images/products");
      const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      for (const file of files) {
        const { secure_url, public_id } = await uploadImage(file.path, bucketPath);
        const product = await Product.findOne({ _id: productId }).exec();
        const lastIndex = product.images.length > 0 ? product.images[product.images.length - 1].index : -1;
        const newIndex = lastIndex + 1;
        await Product.findOneAndUpdate(
          { _id: productId },
          { $push: { images: { index: newIndex, path: public_id, url: secure_url } } },
          { new: true }
        ).exec();
      }
    }
    const product = await Product.findOneAndUpdate({ _id: productId },{
      ...updatedData,
      materials: JSON.parse(updatedData.materials),
      categories: JSON.parse(updatedData.categories)
    },{ new: true }).exec();

    return res.status(200).send(product);
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
};
exports.deleteProduct = async (req, res) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId).exec();
    if (!product) return res.status(404).send();
    if(product.images){
      for(const img of product.images){
        if(img.path){
          await deleteImage(img.path);
        }
      }
    }
    await Product.findByIdAndDelete(productId).exec();
    return res.status(200).send({ productId: product._id, message: "Produit supprimé"});
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
};

exports.deleteManyProducts = async (req, res) => {
  const {productListDeleted} = req.body;
  try {
    let idsList;
    let imagesPathList;
    if(Array.isArray(productListDeleted) && productListDeleted.length){
      idsList = productListDeleted.map(p => p.id)
      imagesPathList = productListDeleted.flatMap(p => p.images?.map(item => item.path));
      await Product.deleteMany({_id:{$in:idsList}}).exec();
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

exports.getProduct = async (req, res) => {
  const productId = req.params.productId;
  try {
    const result = await Product.findById(productId).exec();
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send();
  }
};

exports.getProducts = async (req, res) => {
  const {searchKey, categories, materials, minPrice, maxPrice,} = req.query;
  const query = {};
 
  if (categories) {
    query.categories = { $all: categories.split(',') };;
  }
  if (materials) {
    query.materials = { $all: materials.split(',') };;
  }
  
  if (minPrice) {
    query.price = { ...query.price, $gte: parseFloat(minPrice) };
  }

  if (maxPrice) {
    query.price = { ...query.price, $lte: parseFloat(maxPrice) };
  }
  
  if (searchKey) {
    query.$text = { $search: searchKey };
    // query.$or = [
    //     { name: { $regex: searchKey, $options: 'i' } },
    //     { description: { $regex: searchKey, $options: 'i' } }
    // ];
  }

  // console.log("query ", query);
  try {
    let result;
    if(searchKey && searchKey.trim() !== ''){
      result = await Product.find(query)
      .sort({score:{$meta:'textScore'}})
      .populate("categories","_id name image description")
      .exec();
    }else{
      result = await Product.find(query).populate("categories","_id name image description").exec();
    }
    return res.status(200).send(result);
  } catch (e) {
    console.log(e);
    return res.status(500).send();
  }
};

exports.getProductsByCategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const products = await Product.find({ categories: categoryId }).populate("categories","_id name image description").exec();
    if (!products) return res.status(404).send("Category not found");
    return res.status(200).send(products);
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
};
