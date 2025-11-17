const express = require('express');

const userRouter = express.Router();

userRouter.get("/user/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (!users || users === 0) {
      res.status(404).send("User not found");
    } else {
      const nameList = users
        .map((user) => {
          return `<li>${user.firstName} : ${user.age}</li>`;
        })
        .join("");

      res.send(`<h1>Found Users:</h1><ul>${nameList}</ul>`);
    }
  } catch (err) {
    res.status(400).send("Something went wrong:" + err.message);
  }
});



module.exports = userRouter;