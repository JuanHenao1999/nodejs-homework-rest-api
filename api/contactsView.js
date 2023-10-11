const express = require("express");
const router = express.Router();
const signupCtrl = require("../controllers/signup.controller");
const loginCtrl = require("../controllers/login.controller");
const meCtrl = require("../controllers/me.controller");
const updateAvatarCtrl = require("../controllers/updateAvatar");
const { auth, upload, ctrlWrapper } = require("../middleware");
const {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  removeContact,
} = require("../service/contactModel");

const invalidatedTokens = new Set();

const validToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (invalidatedTokens.has(token)) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Unathorized: Invalid token",
      data: "Unathorized",
    });
  }
  next();
};

router.post("/users/signup", signupCtrl);

router.post("/users/login", loginCtrl);

router.get("/users/current", validToken, auth, meCtrl);

router.patch(
  "/users/avatars",
  validToken,
  auth,
  upload.single("avatar"),
  ctrlWrapper(updateAvatarCtrl)
);

router.post("/users/logout", validToken, auth, (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  invalidatedTokens.add(token);
  console.log(Array.from(invalidatedTokens));
  res.status(204).json({
    status: "success",
    code: 204,
    message: "Logout: successful",
    data: "Success",
  });
});

router.post("/contacts", validToken, auth, async (req, res, next) => {
  const { name, email, phone, favorite } = req.body;
  const owner = req.user._id;
  try {
    const result = await createContact({ name, email, phone, favorite, owner });
    res.status(201).json({
      status: "created",
      code: 201,
      data: { contact: result },
    });
  } catch (e) {
    next(e);
  }
});

router.get("/contacts", validToken, auth, async (req, res, next) => {
  const owner = req.user._id;
  try {
    const result = await getAllContacts({ owner });
    res.status(200).json({
      status: "success",
      code: 200,
      data: { contact: result },
    });
  } catch (e) {
    next(e);
  }
});

router.get("/contacts/:id", validToken, auth, async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await getContactById(id);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: {
          contact: result,
        },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Contact not found by id ${id}`,
        data: "Not found",
      });
    }
  } catch (e) {
    next(e);
  }
});

router.put("/contacts/:id", validToken, auth, async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone, favorite } = req.body;
  try {
    const result = await updateContact(id, {
      name,
      email,
      phone,
      favorite,
    });
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: {
          contact: result,
        },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Contact not found by id ${id}`,
        data: "Not found",
      });
    }
  } catch (e) {
    next(e);
  }
});

router.delete("/contacts/:id", validToken, auth, async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await removeContact(id);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: {
          contact: result,
        },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Contact not found by id ${id}`,
        data: "Not found",
      });
    }
  } catch (e) {
    next(e);
  }
});

router.patch(
  "/contacts/:id/favorite",
  validToken,
  auth,
  async (req, res, next) => {
    const { id } = req.params;
    const { favorite } = req.body;
    try {
      if (favorite === undefined) {
        res.status(400).json({
          status: "error",
          code: 400,
          message: `missing field favorite`,
          data: "Not found",
        });
        return;
      }
      const result = await updateContact(id, {
        favorite,
      });
      if (result) {
        res.json({
          status: "success",
          code: 200,
          data: {
            contact: result,
          },
        });
      } else {
        res.status(404).json({
          status: "error",
          code: 404,
          message: `Contact not found by id ${id}`,
          data: "Not found",
        });
      }
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
