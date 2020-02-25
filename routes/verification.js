const md5 = require("md5"),
    config = require("./../config"),
    mailer = require("./../helpers/mailer"),
    db = require("./../db");

const clientOptions = config.client_Options;

const express = require("express");
const router = express.Router();

//----------------------------------------------------------------------------------------
// Verification functions

router.get("/verify/:id", async (req, res) => {
    const userData = {
        id: req.params.id
    };

    const userUpdate = await db.Users.update({
        _id: userData.id,
        action: { available: true }
    });
    if (userUpdate) {
        res.redirect(clientOptions.url + clientOptions.emailSuccess);
    } else {
        res.json({ success: false });
    }
});
router.get("/password-reset/confirm/:id", async (req, res) => {
    const userData = {
        id: req.params.id
    };

    const newPassword =
        Math.random()
            .toString(36)
            .substring(2, 15) +
        Math.random()
            .toString(36)
            .substring(2, 15);
    const userUpdate = await db.Users.update({
        _id: userData.id,
        action: { password: md5(newPassword) }
    });
    if (userUpdate) {
        const mailResult = await mailer.send({
            source: "password-reset",
            login: userUpdate.login,
            password: newPassword
        });
        if (mailResult) {
            res.json({
                success: true
            });
        } else {
            res.json({
                success: false,
                error:
                    "The constter was not delivered for unknown reasons, try again later"
            });
        }
    }
});

module.exports = router;
