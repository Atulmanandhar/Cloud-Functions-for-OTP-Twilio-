const twilio = require("twilio");

const accountSid = "AC43f4a393c59a4f3655c81f05318a8c80";
const authToken = "59881eeda3227e258d29b104582df08a";

module.exports = new twilio.Twilio(accountSid, authToken);
