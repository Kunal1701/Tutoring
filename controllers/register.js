import myDB from "../db/myDB.js";
import { genPassword } from "./utils/passwordUtilites.js";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

/**
 * Amanda Au-Yeung
 * redirect register
 * @param {obj} req
 * @param {obj} res
 */
export const redirectReg = (req, res) => {
  res.status(200).redirect("/api/register");
};

/**
 * Amanda
 * register user
 * @param {obj} req
 * @param {obj} res
 */
export const register = async (req, res) => {
  let checkExistUser;
  try {
    checkExistUser = await myDB.getUsers(req.body.email);
    if (checkExistUser === null) {
      const { salt, hash } = genPassword(req.body.password);
      await myDB.createUser(req.body.email, salt, hash);
      res
        .status(201)
        .json({ message: "Successfuly register! Head over to sign in!" });
    } else {
      res.json({
        message: "User email already exist, you may sign in!",
        err: "Email",
      });
    }
  } catch (err) {
    res.status(400).send({ err: err });
  }
};

/**
 * Amanda
 * register user
 * @param {obj} req
 * @param {obj} res
 */
export const registerTeacher = async (req, res) => {
  let checkExistUser;
  try {
    checkExistUser = await myDB.getTutors(req.body.email);
    if (checkExistUser === null) {
      const { salt, hash } = genPassword(req.body.password);
      let imageUrl = null;
      imageUrl = await uploadImage(req.body.image);
      const tutorData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        gender: req.body.gender,
        education: req.body.education,
        hours: req.body.hours,
        image: imageUrl,
        num_of_ratings: req.body.num_of_ratings,
        stars: req.body.stars,
        reviews: [],
        subjects: req.body.subjects,
        city: req.body.city,
        location: req.body.location,
      };
      await myDB.createTutor(req.body.email, salt, hash, tutorData);
      res
        .status(201)
        .json({ message: "Successfully registered! Head over to sign in!" });
    } else {
      res.json({
        message: "User email already exists. Please sign in!",
        err: "Email",
      });
    }
  } catch (err) {
    res.status(400).send({ err: err });
  }
};

async function uploadImage(imagePath) {
  try {
      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(imagePath);
      console.log(result);
      const imageUrl = result.secure_url;

      // You can save this image URL to your database or use it as needed
      console.log(`Image uploaded successfully. URL: ${imageUrl}`);
      return imageUrl;
  } catch (error) {
      console.error(`Error uploading image: ${error.message}`);
  }
}