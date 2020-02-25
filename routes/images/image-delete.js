const express = require("express");
const router = express.Router();

const deleteimg = require("../../services/image-delete");

router.post("/image-delete", async (req, res) => {
    await deleteimg(req, res, (err) => {
        if (err) {
            return res.status(404).json({ error: "Delete image wrong!" });
        } else {
            return res.sendStatus(200);
        }
    });
});

module.exports = router;
