import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("home", {
    title: "Home",
  });
});

router.get("/shop", (req, res) => {
  res.render("shop", { title: "Shop" });
});

router.get("/blog", (req, res) => {
  res.render("blog", { title: "Blog" });
});

router.get("/account", (req, res) => {
  res.render("account", { title: "My Account" });
});

export default router;

