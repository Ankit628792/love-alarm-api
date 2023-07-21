var updateEnv = []
var envs = {
    DEVICE_TOKEN_PAYLOAD: process.env.DEVICE_TOKEN_PAYLOAD,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    PROTOCOL: process.env.PROTOCOL,
    HOST: process.env.HOST,

    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_CLUSTER: process.env.DB_CLUSTER,
    DB_DATABASE: process.env.DB_DATABASE,

    SIGHTENGINE_API_USER: process.env.SIGHTENGINE_API_USER,
    SIGHTENGINE_API_SECRET: process.env.SIGHTENGINE_API_SECRET,

    JWT_ACCESS_TOKEN_PRIVATE_KEY: process.env.JWT_ACCESS_TOKEN_PRIVATE_KEY,
    JWT_ISSUER: process.env.JWT_ISSUER,
    JWT_ACCESS_TOKEN_AUDIENCE: process.env.JWT_ACCESS_TOKEN_AUDIENCE,
    JWT_ACCESS_TOKEN_EXPIRE: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRE),

    BCRYPT_SALT: process.env.BCRYPT_SALT,

    STRIPE_SECRET: process.env.STRIPE_SECRET,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

    PRODUCTION_URL: process.env.PRODUCTION_URL,
    EXCHANGE_RATE_API: process.env.EXCHANGE_RATE_API,

    RAZORPAY_API_KEY: process.env.RAZORPAY_API_KEY,
    RAZORPAY_SECRET_KEY: process.env.RAZORPAY_SECRET_KEY,
    RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,

    MAGIC_OTP: process.env.MAGIC_OTP,
    AK: process.env.AK?.toString()
}

trimmer(envs)


if (updateEnv.length > 0) {
    console.error(`##################### update the below env variable ##################`);
    console.error(updateEnv)
    console.error(`##################### update the above env variable ##################`);
    process.exit(1)
}

module.exports = envs;

function trimmer(obj) {
    Object.keys(obj).forEach(item => {
        if (typeof (obj[item]) == 'object') {
            trimmer(obj[item])
        } else if (typeof (obj[item]) == 'string') {
            obj[item] = obj[item].trim()
        }
        if ((obj[item] == undefined) || (obj[item] == null) || (!obj[item])) {
            updateEnv.push(item)
        }
    })
}