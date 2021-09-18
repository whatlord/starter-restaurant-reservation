const knex = require('../db/connection');

function list(){
    return knex("tables").select("*").orderBy("table_name");
}

function read(table_id){
    return knex('tables')
        .where({ table_id })
        .then((records) => records[0])
}

function seat(reservation, table){
    return knex("tables")
        .where({table_id: table.table_id})
        .update({reservation_id: reservation.reservation_id})
        .then(()=>read(table.table_id))
}

function unseat(table){
    return knex("tables")
        .where({table_id: table.table_id})
        .update({reservation_id: null})
        .then(()=>read(table.table_id))
}

function create(table){
    return knex("tables")
        .insert(table)
        .returning("*")
        .then((createRecords) => createRecords[0]);
}

function resUpdate(reservation){
    return knex("reservations")
        .where({reservation_id: reservation.reservation_id})
        .update({status: "seated"})
}



module.exports = {
    list,
    seat,
    unseat,
    read,
    create,
    resUpdate,
}