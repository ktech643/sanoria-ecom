import { Router } from "express";

const router = Router();

router.get("/login", (req, res) => {
  res.render("auth/login", { title: "Login" });
});

export default router;

