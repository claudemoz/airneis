const { User } = require("@models");
const { uploadImage, deleteImage, envPath } = require("@services/upload");

exports.getCustomers = async (req, res, next) => {
  try {
    const user = await User.find({ roles: 'customer' }).exec();
    return res.status(200).send(user);
  } catch (e) {
    console.log(e);
    return res.status(500).send();
  }
};

//recuperer les users qui ont le role admin:
exports.getUsersAdmin = async (req, res, next) => {
  try {
    const users = await User.find({ roles: { $in: ['admin', 'superAdmin'] } }).exec();
    return res.status(200).send(users);
  } catch (e) {
    console.log(e);
    return res.status(500).send();
  }
};


exports.getUser = async (req, res) => {
  try {
    // get user in the url
    const { userId } = req.params;

    const foundUser = await User.findOne({ _id: userId }).exec();

    if (!foundUser) {
      return res.status(404).send("user not found");
    }

    return res.status(200).send(foundUser);
  } catch (error) {
    console.log(error);
    return res.status(500).send("");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const deletedUser = await User.findOneAndDelete({
      _id: userId,
    }).exec();

    if (!deletedUser) {
      return res.status(404).send("user not found");
    }

    return res.status(200).send(deletedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).send("");
  }
};

exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const  photo  = req.files?.photo;
  try {
    const user = await User.findOneAndUpdate({ _id: userId }, req.body, {
      new: true,
    }).exec();
    if (photo) {
      const bucketPath = envPath("/images/users");
      const CropOptions = {
        width: 300,
        height: 300,
        crop: "thumb",
        gravity: "face",
      };
      const { secure_url, public_id } = await uploadImage(
        photo.path,
        bucketPath,
        CropOptions
      );
      user.photo = { path: public_id, url: secure_url };
      await user.save();
    }
    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
};

exports.deleteManyUsers = async (req, res) => {
  const {userListDeleted} = req.body;
  console.log("userListDeleted ", userListDeleted);
  try {
    let idsList;
    let imagesPathList;
    if(Array.isArray(userListDeleted) && userListDeleted.length){
      idsList = userListDeleted.map(p => p.id)
      imagesPathList = userListDeleted.flatMap(p => p.image?.path);
      console.log("idsList ", idsList);
      console.log("categimagesPathListoryListDeleted ", imagesPathList);
      await User.deleteMany({_id:{$in:idsList}}).exec();
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

// exports.createUser = async (req, res) => {
//   const { body } = req;
//   console.log(body);
//   try {
//     const newUser = await User.create(body);

//     return res.status(201).send(newUser);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send();

//   }
// };

exports.createUser = async (req, res) => {
  const { photo } = req.files;
  try {
    const user = await User.create(req.body);
    if (photo) {
      const bucketPath = envPath("/images/users");
      const { secure_url, public_id } = await uploadImage(
        photo.path,
        bucketPath
      );
      user.photo = {
        path: public_id,
        url: secure_url,
      };
      await user.save();
    }
    return res.status(200).send(user);
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
};
