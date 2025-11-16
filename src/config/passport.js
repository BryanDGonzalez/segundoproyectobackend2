const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

// Estrategia Local para login
passport.use('login', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: false
  },
  async (email, password, done) => {
    try {
      // Buscar usuario por email
      const user = await User.findOne({ email: email.toLowerCase() });
      
      if (!user) {
        return done(null, false, { message: 'Email o contraseña incorrectos' });
      }

      // Verificar contraseña
      const isMatch = user.comparePassword(password);
      
      if (!isMatch) {
        return done(null, false, { message: 'Email o contraseña incorrectos' });
      }

      // Usuario autenticado correctamente
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }
));

// Configuración de la estrategia JWT
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  issuer: 'ecommerce-api'
};

// Estrategia JWT para autenticación
passport.use('jwt', new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    // Buscar el usuario por ID
    const user = await User.findById(payload.id).select('-password');
    
    if (!user) {
      return done(null, false, { message: 'Usuario no encontrado' });
    }
    
    // Verificar que el usuario esté activo (puedes agregar un campo 'active' si lo necesitas)
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

// Estrategia "current" para validar usuarios autenticados
passport.use('current', new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    ExtractJwt.fromUrlQueryParameter('token'),
    (req) => {
      // También buscar en cookies
      if (req && req.cookies && req.cookies.jwt) {
        return req.cookies.jwt;
      }
      return null;
    }
  ]),
  secretOrKey: process.env.JWT_SECRET,
  issuer: 'ecommerce-api'
}, async (payload, done) => {
  try {
    const user = await User.findById(payload.id).select('-password');
    
    if (!user) {
      return done(null, false, { message: 'Usuario no encontrado' });
    }
    
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

// Serialización del usuario (para sesiones si las usas)
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
