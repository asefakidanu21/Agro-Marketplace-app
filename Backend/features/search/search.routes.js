


import express from "express";
import { searchProducts } from "./search.controller.js";

const router = express.Router();

router.get("/", searchProducts);

export default router;
