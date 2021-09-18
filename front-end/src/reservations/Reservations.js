import Reservation from "./Reservation";

export default function Reservations({loadDashboard, reses}){

    let listOfReservations = reses.map((reservation) =>{
        
        return <Reservation loadDashboard={loadDashboard} reservation={reservation} key={reservation.reservation_id}/>
    })

    return (
        <div>
            <table className="table table-dark table-striped">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Mobile Number</th>
                        <th scope="col">Time</th>
                        <th scope="col">People</th>
                        <th scope="col">Status</th>
                        <th scope="col">Seat</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Cancel</th>
                    </tr>
                </thead>
                <tbody>
                    {listOfReservations}
                </tbody>
            </table>
        </div>
    )
}