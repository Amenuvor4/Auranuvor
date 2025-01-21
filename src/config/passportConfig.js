const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.OAUTH_CALLBACK_URL}/google`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0]?.value;
        let user = await User.findOne({ email });
        if (!user) {
          user = new User({
            email,
            name: profile.displayName,
          });
          await user.save();
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        done(null, { user, token });
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// GitHub Strategy
passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.OAUTH_CALLBACK_URL}/github`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0]?.value; // GitHub may not always provide email
          if (!email) {
            return done(null, false, { message: 'GitHub account must have a public email.' });
          }
  
          let user = await User.findOne({ email });
          if (!user) {
            user = new User({
              email,
              name: profile.displayName || profile.username, // Use username if displayName is not available
            });
            await user.save();
          }
  
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
          done(null, { user, token });
        } catch (error) {
          done(error, null);
        }
      }
    )
  );

passport.serializeUser((data, done) => done(null, data));
passport.deserializeUser((data, done) => done(null, data));
