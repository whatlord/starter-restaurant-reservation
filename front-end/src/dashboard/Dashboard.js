import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import { today, previous, next } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import Reservations from "../reservations/Reservations";
import Tables from "../tables/Tables";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ obj }) {
  let query = new URLSearchParams(window.location.search)
  let inDate = query.get('date')
  console.log(inDate)
  if(!inDate){
    inDate = today();
  }
  console.log(inDate)
  const [date, setDate] = useState(inDate);
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables({},abortController.signal)
      .then(setTables)
      .catch(setReservationsError)
    return () => abortController.abort();
  }

  const handlePrevious = () =>{
    setDate(previous(date))
  }
  const handleNext = () =>{
    setDate(next(date));
  }
  const handleToday = () =>{
    setDate(today());
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <Reservations loadDashboard={loadDashboard} reses={reservations}/>
      <div className="d-flex flex-wrap justify-content-around mt-5">
          <button type="button" className="btn btn-secondary" onClick={handlePrevious}>Previous</button>
          <button type="button" className="btn btn-secondary" onClick={handleNext}>Next</button>
          <button type="button" className="btn btn-primary" onClick={handleToday}>Today</button>
      </div>
      <Tables loadDashboard={loadDashboard} tables={tables} />
    </main>
  );
}

export default Dashboard;
