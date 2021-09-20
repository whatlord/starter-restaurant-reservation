/**
 * Defines the router for table resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");
const controller = require("./tables.controller");

router.route("/:table_id")
    .get(controller.read)
    .put(controller.seat)
    .delete(controller.unseat)
    .all(methodNotAllowed)

router.route("/")
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed)



module.exports = router;