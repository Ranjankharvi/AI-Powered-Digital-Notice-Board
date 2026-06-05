require("dotenv").config();

const config = {
    port: process.env.PORT || 5000,

    db: {
        uri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/myproject",
    },

    jwt: {
        secret: process.env.JWT_SECRET || "supersecretkey",
        expiresIn: "7d",
    },

    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
        api_key: process.env.CLOUDINARY_API_KEY || "",
        api_secret: process.env.CLOUDINARY_API_SECRET || ""
    },

    email: {
        service: process.env.EMAIL_SERVICE || "gmail",
        user: process.env.EMAIL_USER || "",
        pass: process.env.EMAIL_PASS || ""
    }
};

module.exports = config;
