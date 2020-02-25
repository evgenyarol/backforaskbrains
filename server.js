const express = require("express"),
    bodyParser = require("body-parser"),
    cors = require("cors"),
    morgan = require("morgan"),
    cfg = require("./config.js"),
    userRouter = require("./routes/users"),
    expertRouter = require("./routes/experts"),
    authRouter = require("./routes/oauth"),
    imageRouter = require("./routes/images/image-upload"),
    deleteimageRouter = require("./routes/images/image-delete"),
    verificationRouter = require("./routes/verification"),
    testsRouter = require("./routes/tests");

const app = express();

app.use(cors()); // cors access
app.use(morgan("dev")); // dev logs for express
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use("/user", userRouter, deleteimageRouter, imageRouter);
app.use("/expert", expertRouter);
app.use("/oauth", authRouter);
app.use("/account", verificationRouter);

app.use("/test", testsRouter);

app.listen(cfg["EXPRESS_PORT"], () => {
    console.log(`Express server running on port ${cfg["EXPRESS_PORT"]}.`);
});
