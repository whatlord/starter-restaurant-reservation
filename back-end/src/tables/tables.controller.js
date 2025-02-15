const service = require("./tables.service");
const AEB = require("../errors/asyncErrorBoundary");
const {reservationExists} = require("../reservations/reservations.controller");

/**
 * List handler for table resources
 */

async function list(req, res, next){
    let data = await service.list();
  res.json({
    data
  });
}

async function seat(req, res, next){
  const reservation = res.locals.reservation;
  const table = res.locals.table;
  const data = await service.seat(reservation, table);
  await service.resUpdate(reservation.reservation_id, "seated")
  res.json({data})
}

async function unseat(req, res, next){
  const table = res.locals.table;
  if(!table.reservation_id){
    next({
      status: 400,
      message: `This table is not occupied.`
    })
  }
  await service.resUpdate(table.reservation_id, "finished")
  const data = await service.unseat(table);
  res.json({data})
}

async function tableExists(req, res, next){
  const { table_id } = req.params;
  const foundTable = await service.read(table_id);
  if (foundTable) {
    res.locals.table = foundTable;
    return next();
  }
  next({
    status: 404,
    message: `Table id not found: ${table_id}.`,
  });

}

async function validateSeating(req, res, next){
  const reservation = res.locals.reservation;
  const table = res.locals.table;
  if(table.capacity < reservation.people){
    next({
      status: 400,
      message: `Table cannot seat this size party. capacity: ${table.capacity} Pary size: ${reservation.people}.`
    })
  }else if(table.reservation_id){
    next({
      status: 400,
      message: `This table is occupied by reservation_id: ${table.reservation_id}.`
    })
  }else if(reservation.status === "seated"){
    next({
      status: 400,
      message: `This reservation is already seated.`
    })
  }
  return next();

}

async function validateTable(req, res, next){
  const data = req.body.data;
  if(!data){
    next({
      status: 400,
      message: `data is missing.`
    })
  }
  const {table_name, capacity} = data;
  if(!table_name || !capacity){
    next({
      status: 400,
      message: `'table_name' and 'capacity' are required.`
    })
  }else if(capacity < 1){
    next({
      status: 400,
      message: `capacity must be at least 1.`
    })
  }else if(table_name.length < 2){
    next({
      status: 400,
      message: `table_name must be at least 2 characters.`
    })
  }else{
    return next();
  }
}

async function create(req, res, next){
  service.create(req.body.data)
         .then((data) => res.status(201).json({ data }))
         .catch(next)
}

async function read(req, res, next){
  const table = res.locals.table;
  res.json({table})
}



module.exports = {
    list: [AEB(list)],
    seat: [AEB(tableExists), AEB(reservationExists), AEB(validateSeating), AEB(seat)],
    unseat: [AEB(tableExists), AEB(unseat)],
    create: [AEB(validateTable), AEB(create)],
    read: [AEB(tableExists), AEB(read)],
}