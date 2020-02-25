const validator = require("email-validator"),
    md5 = require("md5"),
    jwt = require("jsonwebtoken"),
    config = require("../config.js"),
    mailer = require("./../helpers/mailer.js"),
    JWTverify = require("./../helpers/auth.js"),
    db = require("./../db.js");

const express = require("express");
const router = express.Router();

//----------------------------------------------------------------------------------------
// Users functions

router.post("/signup", async (req, res) => {
    if (!req.body.login || !req.body.password) {
        res.json({
            success: false,
            error: "Empty login or password"
        });
    }
    const userData = {
        login: req.body.login,
        password: md5(req.body.password)
    };
    if (req.body.password.length < 8) {
        res.json({
            success: false,
            error: "Password must be at least 8 characters"
        });
        return;
    }
    if (!validator.validate(userData.login)) {
        res.json({
            success: false,
            error: "login incorrect, need email format"
        });
    } else {
        try {
            const result = await db.Users.create(userData);
            if (result.login) {
                const link = `http://${req.get("host")}/account/verify/${
                    result._id
                }`;

                await mailer.send({
                    source: "email-verification",
                    login: userData.login,
                    link: link
                });
                res.json({
                    success: true,
                    user: {
                        login: result.login,
                        role: result.role,
                        available: result.available
                    }
                });
            } else {
                res.json({
                    success: false,
                    error: "An unknown error occurred"
                });
            }
        } catch (error) {
            res.json({
                success: false,
                error: "Login already taken"
            });
        }
    }
});
router.post("/login", async (req, res) => {
    if (!req.body.password || !req.body.login) {
        res.json({
            success: false,
            error: "Password and login required"
        });
        return;
    }
    const userData = {
        login: req.body.login,
        password: md5(req.body.password)
    };
    const result = await db.Users.login(userData.login, userData.password);
    if (result) {
        const ans = {
            success: true,
            user: {
                login: result.login,
                role: result.role,
                available: result.available
            }
        };
        if (result.available) {
            const token = jwt.sign({ id: result._id }, config.jwtSECRET, {
                expiresIn: "14 days" // expires in *
            });
            ans.accessTOKEN = token;
        }
        res.json(ans);
    } else {
        res.json({
            success: false,
            error: "Login or password is incorrect"
        });
    }
});

router.post("/password-reset", async (req, res) => {
    const userData = {
        login: req.body.login
    };

    try {
        const result = await db.Users.search(userData.login);
        if (result) {
            const link = `http://${req.get(
                "host"
            )}/account/password-reset/confirm/${result._id}`;
            await mailer.send({
                source: "reset-link",
                login: userData.login,
                link: link
            });
            res.json({
                success: true
            });
        } else {
            res.json({
                success: false,
                error: "User not found"
            });
        }
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            error: "An unknown error occurred"
        });
    }
});

router.post("/self/data", async (req, res) => {
    try {
        const sessionData = await JWTverify(req, res);
        if (sessionData) {
            const user = await db.Users.getOneByID(sessionData.id);
            if (user) {
                console.log(user);
                res.json({ success: true, user: user, session: sessionData });
            } else
                res.json({
                    success: false,
                    error: "User not found"
                });
        } else
            res.json({
                success: false,
                error: "Session not found"
            });
    } catch (error) {
        res.json({
            success: false,
            error: "Session not found"
        });
    }
});

router.post("/update", async (req, res) => {
    const userData = {
        name: req.body.name || null,
        surname: req.body.surname || null,
        about: req.body.about || null,
        keywords: req.body.keywords || []
    };
    console.log(userData);
    try {
        const sessionData = await JWTverify(req, res);
        if (sessionData) {
            const userUpdate = await db.Users.update({
                _id: sessionData.id,
                action: userData
            });
            if (userUpdate) res.json({ success: true });
            else res.json({ success: false });
        } else
            res.json({
                success: false,
                error: "Session not found"
            });
    } catch (error) {
        res.json({
            success: false,
            error: "Session not found"
        });
    }
});

router.post("/settup", async (req, res) => {
    // USER, EXPERT
    const userData = {
        role: req.body.role || null
    };

    if (userData.role != "USER" && userData.role != "EXPERT") {
        res.json({ success: false, error: "Wrong user role" });
    }

    try {
        const sessionData = await JWTverify(req, res);
        if (sessionData) {
            const userUpdate = await db.Users.update({
                _id: sessionData.id,
                action: userData
            });
            if (userUpdate) res.json({ success: true });
            else res.json({ success: false });
        } else
            res.json({
                success: false,
                error: "Session not found"
            });
    } catch (error) {
        res.json({
            success: false,
            error: "Session not found"
        });
    }
});

module.exports = router;
