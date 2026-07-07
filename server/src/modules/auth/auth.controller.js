const passport = require('passport');

const authService = require('./auth.service');
const { MESSAGES } = require('./auth.constants');
const {
  setRefreshTokenCookie,
  setAccessTokenCookie,
  clearAllAuthCookies,
} = require('../../utils/cookie');
const { successResponse } = require('../../utils/response');

class AuthController {
  register = async (req, res, next) => {
    try {
      const user = await authService.register(req.body);
      return successResponse(res, 201, MESSAGES.REGISTER_SUCCESS, { user });
    } catch (error) {
      return next(error);
    }
  };

  login = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body);

    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);

    // Also return token in body for cross-origin deployments where cookies may not persist
    return successResponse(res, 200, MESSAGES.LOGIN_SUCCESS, {
      user,
      token: accessToken,
    });
  } catch (error) {
    return next(error);
  }
};

  logout = async (req, res, next) => {
    try {
      const userId = req.user.id;
      await authService.logout(userId);
      clearAllAuthCookies(res);
      return successResponse(res, 200, MESSAGES.LOGOUT_SUCCESS);
    } catch (error) {
      return next(error);
    }
  };

  refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    const {
      accessToken,
      refreshToken: newRefreshToken,
    } = await authService.refreshToken(token);

    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, newRefreshToken);

    return successResponse(res, 200, MESSAGES.TOKEN_REFRESH_SUCCESS, { token: accessToken });
  } catch (error) {
    return next(error);
  }
};


  getCurrentUser = async (req, res, next) => {
    try {
      const user = await authService.getCurrentUser(req.user.id);
      return successResponse(res, 200, 'User profile retrieved successfully', { user });
    } catch (error) {
      return next(error);
    }
  };

  forgotPassword = async (req, res, next) => {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      return successResponse(res, 200, result.message);
    } catch (error) {
      return next(error);
    }
  };

  resetPassword = async (req, res, next) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
      const result = await authService.resetPassword(token, password);
      return successResponse(res, 200, result.message);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Initiate Google OAuth strategy login flow.
   */
  googleLogin = (req, res, next) => {
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      session: false,
    })(req, res, next);
  };

  /**
   * Handle the redirect callback from Google OAuth.
   */
  googleCallback = (req, res, next) => {
    passport.authenticate(
      'google',
      {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=GoogleAuthFailed`,
      },
      async (err, user) => {
        try {
          if (err || !user) {
            return res.redirect(
              `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=GoogleAuthFailed`
            );
          }

          const {
            user: loggedInUser,
            accessToken,
            refreshToken,
          } = await authService.googleLogin(user);
           setAccessTokenCookie(res, accessToken);
           setRefreshTokenCookie(res, refreshToken);

          let redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`;
          if (loggedInUser.role === 'volunteer') {
            const isProfileComplete = !!(
              loggedInUser.phone &&
              loggedInUser.college &&
              loggedInUser.course &&
              loggedInUser.city &&
              loggedInUser.state
            );
            if (!isProfileComplete) {
              redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/profile/setup`;
            }
          }

          return res.redirect(`${redirectUrl}?token=${accessToken}`);
        } catch (error) {
          return next(error);
        }
      }
    )(req, res, next);
  };
}

module.exports = new AuthController();
