const profile = process.env.NODE_ENV

function resolve() {
    console.log(`Node enviroment ${profile}`);
    if (!profile) {
        return ".env";
    }
    switch (profile) {
        case "test":
            return ".env.test";
        case "dev":
            return ".env.dev";
        default:
            return ".env";
    }
}

module.exports = {
    resolve
}