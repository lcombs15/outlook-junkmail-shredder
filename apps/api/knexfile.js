const path = require("path");

module.exports = {
    migrations: {
        directory: path.join(__dirname, "src/migrations"),
        extension: "ts",
    },
    useNullAsDefault: true,
};
