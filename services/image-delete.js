const config = require("../config");
const aws = require("aws-sdk");

aws.config.update({
    secretAccessKey: config.AWS_SECRET_ACCESS,
    accessKeyId: config.AWS_ACCESS_KEY,
    region: "us-east-2"
});

const s3 = new aws.S3();

const deleteimg = (req, res) => {
    if (!req.body.url) {
        return res.sendStatus(400);
    } else {
        const url = req.body.url;

        const newKey = url.substring(url.lastIndexOf("/")).substr(1);

        const params = { Bucket: "askbrains-images", Key: newKey };

        s3.deleteObject(params, (err) => {
            if (err) {
                return res.status(404).json({ error: "Delete image wrong!" });
            } else {
                return res.sendStatus(200);
            }
        });
    }
};

module.exports = deleteimg;
