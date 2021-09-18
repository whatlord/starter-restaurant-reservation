import { useState } from "react";
import Reservations from "../reservations/Reservations";
import { listReservations } from "../utils/api";
import ErrorAlert from "./ErrorAlert";

export default function Search(){

    const initialFormData = {
        mobile_number: "",
    };
    const [searched, setSearched] = useState(false)
    const [formData, setFormData] = useState(initialFormData);
    const [reservations, setReservations] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);

    const handleChange = (event) => {
        const value =
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value;
        setFormData({
          ...formData,
          [event.target.name]: value,
        });
    }


    const handleSubmit = async (event) => {
        const abortController = new AbortController();
        try{
            event.preventDefault();
            setSearched(true);
            await listReservations(formData, abortController.signal)
                .then(setReservations)
                .catch(setReservationsError);
        }catch(error){
          setReservationsError(error);
        }
        return () => abortController.abort();
    };

    return (
        <div>
            <ErrorAlert error={reservationsError} />
            <form onSubmit={handleSubmit}>
                <div className="form-group row m-5">
                    <div className="col-11">
                        <input
                            name="mobile_number"
                            type="text"
                            className="form-control"
                            placeholder="Enter Customer's phone number"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-1">
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >Find</button>
                    </div>
                </div>
            </form>
            {(searched)? 
                ((reservations.length > 0)?

                    (<Reservations reses={reservations} />) :
                    (<div>No reservations found.</div>)) : (<div></div>)
            }
        </div>
    )
}