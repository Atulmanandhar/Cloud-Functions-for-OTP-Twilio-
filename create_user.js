const admin = require("firebase-admin");

module.exports = function (req, res) {
  //verify the user provided a phone number
  if (!req.body.phone) {
    return res.status(422).send({ error: "Bad input" });
  }

  //format the phone number to remove dashes and parenthesis
  //regex to match anything that is not a digit
  const phone = String(req.body.phone).replace(/[^\d]/g, "");
  //Create a new user account using the number
  admin
    .auth()
    .createUser({ uid: phone })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => res.status(422).send({ error: err }));

  //respond the user request, saying the account was made
};
