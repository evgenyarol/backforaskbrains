const db = require("./../db.js");

const express = require("express");
const router = express.Router();

//----------------------------------------------------------------------------------------
// Tests functions

router.get("/users", async (req, res) => {
    const users = await db.Users.getAll();
    res.json(users);
});

router.post("/add/experts", async (req, res) => {
    const options = {
        size: req.body.size || 0
    };
    const insertedItems = [];
    for (const i = 0; i < options.size; i++) {
        const expertExample = {
            id: i,
            keywords: ["bitcoin", "farming"],
            expertType: ["Mentor", "Adviser"],
            socialLinks: [
                {
                    name: "LinkedIn",
                    link: "https://linkedin.com/test"
                },
                {
                    name: "Facebook",
                    link: "https://facebook.com/test"
                }
            ],
            login: `${i}_${Math.random()
                .toString(36)
                .substring(2, 15) +
                Math.random()
                    .toString(36)
                    .substring(2, 15)}`,
            name: "Name Test",
            surname: "Surname Test",
            createdAt: "2019-11-14T11:44:28.007Z",
            role: "EXPERT",
            available: true,
            about: "Its some text about me",
            biography: "Its my biography right now, hello there!",
            currency: "USD",
            rate: 20
        };
        insertedItems.push(expertExample);
    }
    await db.Users.insertMany(insertedItems);
    res.json({ success: true });
});

module.exports = router;
