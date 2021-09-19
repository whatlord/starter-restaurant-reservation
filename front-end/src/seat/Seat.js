import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { readReservation, listTables, seatTable } from "../utils/api";

export default function Seat(){

    const history = useHistory();
    const { reservation_id } = useParams();

    const initialFormData = {
        table_id: ""
    };
    
    const [formData, setFormData] = useState(initialFormData);
    const [tables, setTables] = useState([])
    const [seatsNeeded, setSeatsNeeded] = useState(1);
    const [newSeatError, setNewSeatError] = useState(null);

    useEffect(() =>{
        async function getTables(){
            const { people } = await readReservation(reservation_id);
            const response = await listTables();
            setTables(response)
            setSeatsNeeded(Number(people))
        }
        getTables();
    },[reservation_id])

    let options = tables.map(table => {
        
        return <option key={table.table_id} value={table.table_id}>{table.table_name} - {table.capacity}</option>
    })

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
        try{
        event.preventDefault();
        const table = tables.find(table => table.table_id === Number(formData.table_id));
        console.log(formData)
        console.log(table)
        if(!formData.table_id){
            throw new Error(`Please select a table`)
        }else if(seatsNeeded > table.capacity ){
            throw new Error(`This table is not big enough for this party.`)
        }else if(table.reservation_id){
            throw new Error(`This table is occupied. Pleach choose another table.`)
        }
        await seatTable(formData.table_id, reservation_id);
        setFormData(initialFormData);
        history.push(`/dashboard`)
        }catch(error){
          setNewSeatError(error);
        }
    }

    const handleCancel = () => {
        history.goBack();
    }

    return (
        <div>
            <ErrorAlert error={newSeatError} />
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="table_id">Table:</label>
                    <select 
                        name="table_id" 
                        className="form-control"
                        onChange={handleChange}
                    >
                        <option value={null} default>--Choose a table--</option>
                        {options}

                    </select>
                </div>
                <div>
                    
                </div>
                <div className="d-flex flex-wrap justify-content-around mt-5">
                    <button type="submit" className="btn btn-primary">submit</button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>cancel</button>
                </div>
            </form>
        </div>
    )
}