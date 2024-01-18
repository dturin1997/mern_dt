import { Router } from "express";
import {
  getCategories,
  newCategory,
  deleteCategory,
  saveAttr,
} from "../controllers/categoryController.js";

import {
  verifyIsLoggedIn,
  verifyIsAdmin,
} from "../middleware/verifyAuthToken.js";

const router = Router();

router.get("/", getCategories);

router.use(verifyIsLoggedIn);
router.use(verifyIsAdmin);
router.post("/", newCategory);
router.delete("/:category", deleteCategory);
router.post("/attr", saveAttr);

export default router;
