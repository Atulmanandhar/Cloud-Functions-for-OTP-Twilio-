const admin = require("firebase-admin");
const twilio = require("./twilio");

module.exports = function (req, res) {
  if (!req.body.phone) {
    return res.status(422).send({ error: "You must provide a phone number" });
  }

  const phone = String(req.body.phone).replace(/[^\d]/g, "");

  admin
    .auth()
    .getUser(phone)
    .then((userRecord) => {
      //code between 1000-9999
      const code = Math.floor(Math.random() * 8999 + 1000);

      //body,to,from:generated using twilio
      twilio.messages.create(
        {
          body: `Your code is ${code}`,
          to: `+977${phone}`,
          from: "+18304200762",
        },
        (err) => {
          if (err) res.status(422).send({ error: err });
          admin
            .firestore()
            .collection("users")
            .doc(phone)
            .set({
              code: code,
              codeValid: true,
            })
            .then(() => {
              res.send({ success: true });
            })
            .catch((err) => res.status(500).json({ error: err }));
        }
      );
    })
    .catch((err) => {
      return res.status(422).send({ error: err });
    });
};
