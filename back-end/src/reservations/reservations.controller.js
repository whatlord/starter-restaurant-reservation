const service = require('./reservations.service.js');
const AEB = require('../errors/asyncErrorBoundary.js')
const validStatuses = ["booked", "seated", "finished", "cancelled"];

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const query = req.query;
  let data = await service.list(query.date, query.mobile_number);
  res.json({
    data
  });
}

async function reservationExists(req, res, next) {
  let { reservation_id } = req.params;
  const data = req.body.data;
  if(!reservation_id && !data){
    next({
      status: 400,
      message: `data is missing`,
    });
  }
  if(!reservation_id){
    reservation_id = data.reservation_id;
  }
  if(!reservation_id){
    next({
      status: 400,
      message: `missing reservation_id`,
    });
  }
  const foundRes = await service.read(reservation_id);
  if (foundRes) {
    res.locals.reservation = foundRes;
    return next();
  }
  next({
    status: 404,
    message: `reservation_id not found: ${reservation_id}`,
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
  const { data: { first_name, last_name, mobile_number, reservation_date, reservation_time, people } = {} } = req.body;
  if(first_name && last_name && mobile_number && reservation_date && reservation_time && people && typeof people === "number"){
      if(/^\d{4}-\d{2}-\d{2}$/.test(reservation_date)){
        if(/^\d{2}:\d{2}$/.test(reservation_time) || /^\d{2}:\d{2}:\d{2}$/.test(reservation_time)){
          return next();
        }else{
          next({
            status: 400,
            message: `reservation_time must be in hh:mm format.`
        })
        }
      }else{
        next({
          status: 400,
          message: `reservation_date must be in yyyy-mm-dd format.`
        })
      }
      
    
  }
  if(!first_name){
    next({
      status: 400,
      message: `first_name is missing or empty`
    })
  }else if(!last_name){
    next({
      status: 400,
      message: `last_name is missing or empty`
    })
  }else if(!mobile_number){
    next({
      status: 400,
      message: `mobile_number is missing or empty`
    })
  }else if(!mobile_number){
    next({
      status: 400,
      message: `mobile_number is missing or empty`
    })
  }else if(!reservation_date){
    next({
      status: 400,
      message: `reservation_date is missing or empty`
    })
  }else if(!reservation_time){
    next({
      status: 400,
      message: `reservation_time is missing or empty`
    })
  }else if(!people){
    next({
      status: 400,
      message: `people is missing or zero`
    })
  }else if(typeof(people) != "number"){
    next({
      status: 400,
      message: `people is not a number`
    })
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
      message: `reservation_time must be between 10:30 AM and 9:30 PM.`
    })
  }else if(date.getDay() == 2){
    next({
      status: 400,
      message: `The restaurant is closed on tuesdays.`
    })
  }else{
    return next();
  }

}

async function updateStatus(req, res, next){
  const reservation = res.locals.reservation;
  const {status} = req.body.data;

  if(reservation.status === "finished"){
    next({
      status: 400,
      message: `finished reservation cannot be updated.`
    })
  }else if(!validStatuses.includes(status)){
    next({
      status: 400,
      message: `${status} is not a valid status.`
    })
  }
  const updatedRes = {
    ...reservation,
    status
  }
  const data = await service.update(updatedRes);
  res.json({ data})
}

async function update(req, res, next){
  const reservation = req.body.data;
  const data = await service.update(reservation);
  res.json({data})
}
async function createStatusValid(req, res, next){
  const { status } = req.body.data;
  if(status === "finished" || status === "seated"){
    next({
      status: 400,
      message: `status cannot be seated of finished for a new reservation.`
    })
  }else{
    return next();
  }
}



module.exports = {
  list: [AEB(list)],
  create: [AEB(reservationValid), AEB(reservationTimeValid), AEB(createStatusValid), AEB(create)],
  read: [AEB(reservationExists), read],
  updateStatus: [AEB(reservationExists), AEB(updateStatus)],
  update: [AEB(reservationExists), AEB(reservationValid), AEB(reservationTimeValid), AEB(update)],
  reservationExists,
};
