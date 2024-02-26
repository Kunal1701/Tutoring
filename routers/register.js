import express from "express";
const router = express.Router();
import {
  redirectReg,
  register,
  registerTeacher,
} from "../controllers/register.js";

// Amanda Au-Yeung
router.get("/api/register", redirectReg);

//register
router.post("/api/register", register);

router.post("/api/register-teacher", registerTeacher);

export default router;
