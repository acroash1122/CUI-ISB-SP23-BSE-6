const express = require('express');
const router = express.Router();

router.get('/user/logout', (req, res) => {

    const isProduction = process.env.NODE_ENV === 'production';

    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        path: '/'
    };

    const authCookies = ['token', 'jwt', 'connect.sid'];
    authCookies.forEach(name => res.clearCookie(name, cookieOptions));

    const uiCookies = ['userRole', 'userId', 'userName', 'isLoggedIn'];
    uiCookies.forEach(name => res.clearCookie(name, cookieOptions));

    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Logout Error (Session):', err);
            }
            res.redirect('/user/login');
        });
    } else {
        res.redirect('/user/login');
    }
});

module.exports = router;
