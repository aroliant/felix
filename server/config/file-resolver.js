const profile = process.env.NODE_ENV

function resolve() {
    console.log(`Node enviroment ${profile}`);
    if (!profile) {
        return ".env";
    }
    switch (profile) {
        case "test":
            return ".env.test";
        case "development":
            return ".env.dev";
        default:
            return ".env";
    }
}

module.exports = {
    resolve
}