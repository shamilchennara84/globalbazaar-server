const passport = require("passport");
require("../config/passport");

const jwtVerify = passport.authenticate("jwt", { session: false });

module.exports = { jwtVerify };
