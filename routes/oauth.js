const config = require("./../config.js");
const db = require("./../db.js");
const jwt = require("jsonwebtoken");

const express = require("express");
const router = express.Router();

const linkedin_Options = config.linkedin_Options;
const client_Options = config.client_Options;

const LinkedIn = new (require("./../helpers/LinkedInApi.js"))(
    linkedin_Options.appid,
    linkedin_Options.secret,
    linkedin_Options.callback
);

//----------------------------------------------------------------------------------------
// OAuth

router.get("/linkedin/", async (req, res) => {
    const scope = ["r_emailaddress", "r_liteprofile"];
    res.redirect(LinkedIn.getAuthorizationUrl(scope, "state"));
});

router.get("/linkedin/callback", async (req, res) => {
    const user = {
        firstName: null,
        lastName: null,
        email: null,
        picture: null
    };
    const accessToken = await LinkedIn.getAccessToken(
        req.query.code,
        req.query.state
    );
    const userData = await LinkedIn.getCurrentMemberProfile(
        accessToken.access_token
    );
    const userPictureData = await LinkedIn.getCurrentMemberPicture(
        accessToken.access_token
    );
    const userMail = await LinkedIn.getCurrentMemberEmail(
        accessToken.access_token
    );

    if (userPictureData.profilePicture) {
        const imagesLength =
            userPictureData.profilePicture["displayImage~"].elements.length;
        user.picture =
            userPictureData.profilePicture["displayImage~"].elements[
                imagesLength - 1
            ].identifiers[0].identifier;
    }

    user.email = userMail.elements[0]["handle~"].emailAddress;
    user.firstName = userData.localizedFirstName;
    user.lastName = userData.localizedLastName;

    console.log(user);
    const isUser = await db.Users.search(user.email);
    if (!isUser) {
        const newUser = await db.Users.create({
            login: user.email,
            password: null,
            name: user.firstName,
            surname: user.lastName,
            available: true,
            picture: user.picture
        });
        const token = jwt.sign({ id: newUser._id }, config.jwtSECRET, {
            expiresIn: "14 days"
        });
        const socialid = jwt.sign({ accessToken: token }, config.jwtSECRET, {
            expiresIn: "3 hours"
        });
        res.redirect(
            `${client_Options.url +
                client_Options.socialSuccess}/?socialid=${socialid}`
        );
    } else {
        const token = jwt.sign({ id: isUser._id }, config.jwtSECRET, {
            expiresIn: "14 days"
        });
        const socialid = jwt.sign({ accessToken: token }, config.jwtSECRET, {
            expiresIn: "3 hours"
        });
        res.redirect(
            `${client_Options.url +
                client_Options.socialSuccess}/?socialid=${socialid}`
        );
    }
});

router.post("/linkedin/confirm", async (req, res) => {
    const confirmKey = req.body.socialid;
    if (!confirmKey) {
        res.json({
            success: false,
            error: "Token is empty"
        });
    }
    try {
        const sessionData = await jwt.verify(confirmKey, config.jwtSECRET);
        if (sessionData) {
            res.json({
                success: true,
                accessTOKEN: sessionData.accessToken
            });
        }
    } catch (error) {
        res.json({
            success: false,
            error: "Token is not confirmed"
        });
    }
});

module.exports = router;
