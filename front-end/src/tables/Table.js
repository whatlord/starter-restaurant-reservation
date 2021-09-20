import { useState } from "react";
import { unseatTable, updateReservationStatus } from "../utils/api";

export default function Table({loadDashboard, tabl}){

    const [table, setTable] = useState(tabl);

    const handleClick = async () =>{
        const choice = window.confirm("Is this table ready to seat new guests?\n\nThis cannot be undone.");
        if(choice){
            const result = await unseatTable(table.table_id, table.reservation_id);
            setTable(result);
            loadDashboard();
        }
    }
    return (
        <tr>
            <th scope="row">{table.table_id}</th>
            <td>{table.table_name}</td>
            <td>{table.capacity}</td>
            <td data-table-id-status={table.table_id}>{(table.reservation_id)? "Occupied":"Free"}</td>
            <td>
                {(table.reservation_id)?

                (<button 
                    className="btn btn-secondary mr-2" 
                    data-table-id-finish={table.table_id}
                    onClick={handleClick}
                >Finish</button>):( <></>)
                }
            </td>
        </tr>
    )
}