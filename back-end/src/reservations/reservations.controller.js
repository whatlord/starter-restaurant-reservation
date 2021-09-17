const service = require('./reservations.service.js');
const AEB = require('../errors/asyncErrorBoundary.js')

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const query = req.query;
  console.log(query)
  let data = await service.list(query.date, query.mobile_number);
  res.json({
    data
  });
}

async function reservationExists(req, res, next) {
  let { reservation_id } = req.params;
  if(!reservation_id){
    reservation_id = req.body.data.reservation_id;
  }
  console.log(reservation_id)
  const foundRes = await service.read(reservation_id);
  console.log("ran find")
  if (foundRes) {
    res.locals.reservation = foundRes;
    console.log("sending find to next")
    return next();
  }
  next({
    status: 404,
    message: `Reservation id not found: ${reservation_id}`,
  });
};

function read(req, res, next) {
  res.json({ data: res.locals.reservation });
};

async function create(req, res, next){
  service.create(req.body.data)
         .then((data) => res.status(201).json({ data }))
         .catch(next)

}

async function reservationValid(req, res, next){
  console.log("received finding")
  const { data: { first_name, last_name, mobile_number, reservation_date, reservation_time, people } = {} } = req.body;
  if(first_name && last_name && mobile_number && reservation_date && reservation_time && people){
    console.log("pass first round")
      if(/^\d{4}-\d{2}-\d{2}$/.test(reservation_date)){
        if(/^\d{2}:\d{2}$/.test(reservation_time) || /^\d{2}:\d{2}:\d{2}$/.test(reservation_time)){
          console.log("resValid");
          return next();
        }else{
          next({
            status: 400,
            message: `reservation time must be in hh:mm format.`
        })
        }
      }else{
        next({
          status: 400,
          message: `reservation date must be in yyyy-mm-dd format.`
        })
      }
      
    
  }
}

async function reservationTimeValid(req, res, next){
  const { data: { first_name, last_name, mobile_number, reservation_date, reservation_time, people } = {} } = req.body;
  const date = new Date(`${reservation_date} ${reservation_time} CST`)
  if(Date.now() > date.getTime()){
    next({
      status: 400,
      message: `Reservation must be in the future.`
    })
  }else if(reservation_time < `10:30` || reservation_time > `21:30`){
    next({
      status: 400,
      message: `Reservation must be between 10:30 AM and 9:30 PM.`
    })
  }else if(date.getDay() == 2){
    next({
      status: 400,
      message: `Reservation must not be on a tuesday.`
    })
  }else{
    console.log("resTimeValid")
    return next();
  }

}

async function updateStatus(req, res, next){
  const reservation = res.locals.reservation;
  const {status} = req.body.data;
  const updatedRes = {
    ...reservation,
    status
  }
  console.log(reservation, status, updatedRes)
  const data = await service.update(updatedRes);
  res.json({ data})
}

async function update(req, res, next){
  const reservation = req.body.data;
  console.log(reservation)
  const data = await service.update(reservation);
  res.json({data})
}

module.exports = {
  list: [AEB(list)],
  create: [AEB(reservationValid), AEB(reservationTimeValid), AEB(create)],
  read: [AEB(reservationExists), read],
  updateStatus: [AEB(reservationExists), AEB(updateStatus)],
  update: [AEB(reservationExists), AEB(reservationValid), AEB(reservationTimeValid), AEB(update)],
  reservationExists,
};
