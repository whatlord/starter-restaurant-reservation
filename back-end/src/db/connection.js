const environment = process.env.NODE_ENV || "development";
console.log(environment)
const config = require("../../knexfile")[environment];
console.log(config)
const knex = require("knex")(config);

module.exports = knex;
