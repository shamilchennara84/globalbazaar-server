const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const Admin = require("../models/Admin");
const Vendor = require("../models/Vendor");
const dotenv = require("./dotenv");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: dotenv.JWT_SECRET,
};

const setupJwtStrategy = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        let model;

        switch (jwt_payload.role) {
          case 'admin':
            model = Admin;
            break;
          case 'vendor':
            model = Vendor;
            break;
          default:
            return done(null, false, { message: 'Invalid role' });
        }

        const user = await model.findById(jwt_payload.id);

        if (user) {
          return done(null, { ...user.toObject(), role: jwt_payload.role });
        } else {
          return done(null, false, { message: 'User not found' });
        }
      } catch (error) {
        console.error(`Error in JWT Strategy: ${error.message}`);
        return done(error, false);
      }
    })
  );
};

module.exports = setupJwtStrategy;
