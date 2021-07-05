const admin = require("firebase-admin");
const { ref } = require("firebase-functions/lib/providers/database");

// module.exports = function (req, res) {
//   if (!req.body.phone || !req.body.code) {
//     return res.status(422).send({ error: "Phone and code must be provided" });
//   }

//   const phone = String(req.body.phone).replace(/[^\d]/g, "");
//   const code = parseInt(code);

//   admin
//     .auth()
//     .getUser(phone)
//     .then(() => {
//       const databaseRef = admin.firestore().collection("users").doc(phone);
//       databaseRef
//         .get()
//         .then((doc) => {
//           const { code: firestoreCode, codeValid } = doc.data();
//           if (firestoreCode !== code || !codeValid) {
//             return res.status(422).send({ error: "Code not valid" });
//           }

//           ref.update({ codeValid: false });
//         })
//         .catch((err) => {
//           return res.status(422).send({ error: err });
//         });
//     })
//     .catch((err) => res.status(422).send({ error: err }));
// };

module.exports = async (req, res) => {
  if (!req.body.phone || !req.body.code) {
    return res.status(422).send({ error: "Phone and code must be provided" });
  }

  const phone = String(req.body.phone).replace(/[^\d]/g, "");
  const code = parseInt(req.body.code);

  try {
    const checkUserModel = await admin.auth().getUser(phone);
    const databaseRef = admin.firestore().collection("users").doc(phone);
    const doc = await databaseRef.get();
    const { code: firestoreCode, codeValid } = doc.data();
    if (firestoreCode !== code || !codeValid) {
      return res.status(422).send({ error: "Code not valid" });
    }
    const updateCodeValid = await databaseRef.update({ codeValid: false });
    const JwtToken = await admin.auth().createCustomToken(phone)
    res.send({token:JwtToken})

  } catch (err) {
    return res.status(422).send({ error: err });
  }
};
