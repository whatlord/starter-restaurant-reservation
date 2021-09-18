import { Link } from "react-router-dom";
import { updateReservationStatus } from "../utils/api";

export default function Reservation({loadDashboard, reservation}){
    const reservation_id = reservation.reservation_id;

    const handleCancel = async () =>{
        const abortController = new AbortController();
        const choice = window.confirm("Do you want to cancel this reservation?\n\nThis cannot be undone.");
        if(choice){
            await updateReservationStatus(reservation_id, "cancelled", abortController.signal);
            loadDashboard();
        }
        return () => abortController.abort();
    }
    return (
        <tr>
            <th scope="row">{reservation.reservation_id}</th>
            <td>{reservation.first_name}</td>
            <td>{reservation.last_name}</td>
            <td>{reservation.mobile_number}</td>
            <td>{reservation.reservation_time}</td>
            <td>{reservation.people}</td>
            <td
                data-reservation-id-status={reservation.reservation_id}
            >{reservation.status}</td>
            <td>
                {reservation.status === "booked" ? (<Link 
                    className="btn btn-secondary mr-2"
                    to={`/reservations/${reservation_id}/seat`}
                    href='/reservations/${reservation_id}/seat'
                >Seat</Link>) : ( <></>)}
            </td>
            <td>
                {reservation.status === "booked" ? (<Link 
                    className="btn btn-secondary mr-2"
                    to={`/reservations/${reservation_id}/edit`}
                >Edit</Link>) : ( <></>)}
            </td>
            <td>
                <button 
                    className="btn btn-secondary mr-2"
                    data-reservation-id-cancel={reservation.reservation_id}
                    onClick={handleCancel}
                >Cancel</button>
            </td>
        </tr>
    )
}