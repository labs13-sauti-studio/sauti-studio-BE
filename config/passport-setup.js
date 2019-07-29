const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const Users = require('../models/user-models');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// console.log("process.env.FACEBOOK_CLIENT_ID ", process.env.FACEBOOK_CLIENT_ID)

// passport.use(
//   new FacebookStrategy(
    
//     {
      
//       clientID: process.env.FACEBOOK_CLIENT_ID,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//       callbackURL: process.env.REDIRECT_URL,
//       profileFields: ['id', 'displayName', 'photos', 'email'],
//     },
//     (accessToken, refreshToken, profile, done) => {
//       verifyFacebookUser(profile, done);
//     }
//   )
// );

passport.use(
  new GoogleStrategy(
    {
      callbackURL: '/auth/google/redirect',
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    (accessToken, refreshToken, profile, done) => {
      verifyGoogleUser({ profile, token: accessToken }, done);
    }
  )
);

const verifyGoogleUser = async (obj, done) => {
  console.log("!!!!!!!!!!!!!!!!!!!!!!")
  const { profile, token } = obj;
  const user = await Users.getByEmail(profile.emails[0].value).catch(err =>
    console.error(err)
  );

  try {
    if (!user) {
      const [id] = await Users.add({
        display_name: profile.displayName,
        email: profile.emails[0].value,
        google_id: profile.id,
        pic: profile._json.picture,
      });
      done(null, await Users.getById(id), token);
    } else {
      done(null, user, token);
    }
  } catch (err) {
    console.error(err);
  }
};

// const verifyFacebookUser = async (profile, done) => {
//   const facebookUser = await Users.getByEmail(profile.emails[0].value);

//   console.log(profile);

//   try {
//     if (!facebookUser) {
//       const newFacebookUser = await Users.add({
//         display_name: profile.displayName,
//         email: profile.emails[0].value,
//         facebook_id: profile.id,
//         pic: profile._pic,
//       });

//       done(null, newFacebookUser);
//     } else {
//       done(null, facebookUser);
//     }
//   } catch (err) {
//     console.error(err);
//   }
// };
