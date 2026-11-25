import cloudinary from "./cloudinary.js";

const uploadImage = (fileBuffer) => {
    console.log("Starting Cloudinary upload...");

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: "agro-shop",
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    console.log("Cloudinary error:", error);
                    reject(error);
                } else {
                    console.log("Cloudinary upload successful");
                    resolve(result.secure_url);
                }
            }
        ).end(fileBuffer);
    });
};

export default uploadImage;