const {
    getUsers,
    postUser,
    deleteUser,
    updateUser,
    getImage,
    getUser,
    validateUser,
    check,
  } = require("../controller/userController");
const { verifyUser } = require("../middleware/verify");


function userData(router) {
    router._get("/v1/getUsers", getUsers, [verifyUser]);
    router._get("/v1/getUsers/:username", getUser, [verifyUser]);
    router._get("/v1/getimage", getImage, [verifyUser]);
    router._post("/v1/register", postUser, [verifyUser]);
    router._post("/v1/login", validateUser, [verifyUser]);
    router._post("/v1/check", check, [verifyUser]);
    router._delete("/v1/getUsers/delete/:username", deleteUser, [
      verifyUser,
    ]);
    router._put("/v1/getUsers/update/:username", updateUser, [verifyUser]);
    //this.router._patch("/v1/getUsers/update/:username", updateUser,[verifyUser]);
  }

  module.exports= userData;