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
      const tutorData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        gender: req.body.gender,
        education: req.body.education,
        hours: req.body.hours,
        num_of_ratings: req.body.num_of_ratings,
        stars: req.body.stars,
        reviews: [],
        subjects: req.body.subjects,
        location: req.body.location,
        image: await uploadImage(req.body.image),
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
  let url = "";
  const data = new FormData();
  data.append("file", imagePath);
  data.append("upload_preset", "kunaldemo");
  data.append("cloud_name", "dhtop7em9");

  await fetch("https://api.cloudinary.com/v1_1/dhtop7em9/image/upload", {
    method: "post",
    body: data,
  })
    .then((res) => res.json())
    .then((data) => {
      url = data.url;
    })
    .catch((error) => {
      console.log(error);
    });
  return url;
}
