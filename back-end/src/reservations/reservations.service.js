const knex = require('../db/connection');

function list(date, mobile_number){
    if(!mobile_number){
        if(date){
            console.log("date")
            return knex('reservations').select('*').where({reservation_date: date}).whereNot({status: "finished"}).whereNot({status: "cancelled"}).orderBy("reservation_time");
        }else{
            console.log("no date")
            return knex('reservations').select('*').orderBy("reservation_time");
        }
    }else{
        return knex("reservations")
            .whereRaw(
            "translate(mobile_number, '() -', '') like ?",
            `%${mobile_number.replace(/\D/g, "")}%`
            )
            .orderBy("reservation_date");
    }
}

function create(data){
    return knex('reservations')
      .insert(data)
      .returning("*")
      .then((createRecords) => createRecords[0]);
}

function read(reservation_id){
    return knex('reservations')
        .where({ reservation_id })
        .then((records) => records[0])
}

function update(reservation){
    console.log("reached updat")
    return knex('reservations')
        .where({ reservation_id: reservation.reservation_id})
        .update(reservation, "*")
        .then(()=>read(reservation.reservation_id))
}



module.exports = {
    list,
    create,
    read,
    update,
}