import { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";



function NewTable(){

    const history = useHistory();

    const initialFormData = {
        table_name: "",
        capacity: 1,
      };
    const [formData, setFormData] = useState(initialFormData);
    const [newTableError, setNewTableError] = useState(null);

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
        await createTable(formData, abortController.signal);
        setFormData(initialFormData);
        history.push(`/dashboard`)
        }catch(error){
          setNewTableError(error);
        }
        return () => abortController.abort();
    }

    const handleCancel = () => {
        history.goBack();
    }

    

    return (
        <div className="m-5">
            <ErrorAlert error={newTableError}/>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="table_name">Table Name:</label>
                    <input 
                        id="table_name"
                        name="table_name" 
                        type="text"
                        required
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="capacity">Capacity:</label>
                    <input 
                        id="capacity"
                        name="capacity" 
                        type="number"
                        min="1"
                        required
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="d-flex flex-wrap justify-content-around mt-5">
                    <button type="submit" className="btn btn-primary">submit</button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>cancel</button>
                </div>
            </form>
        </div>
    )
}

export default NewTable;