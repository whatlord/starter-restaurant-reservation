import React, {useEffect, useState} from "react";
import { useParams, useHistory } from "react-router-dom";
import ErrorAlert from "./ErrorAlert";
import { today } from "../utils/date-time";
import { createReservation, readReservation, updateReservation } from "../utils/api";

export default function Form(){

    const {reservation_id} = useParams();

    const history = useHistory();
    const onDate = today();

    const initialFormData = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 0,
    };
    const [formData, setFormData] = useState(initialFormData);
    const [newResError, setNewResError] = useState(null);

    useEffect(()=>{
        const abortController = new AbortController();
        const getRes = async () => {
            const theRes = await readReservation(reservation_id, abortController.signal);
            setFormData(theRes)
        }
        if(reservation_id){
            getRes();
        }
        return () => abortController.abort();
    },[reservation_id])

  function loadError(){
    if(!checkDay(formData.reservation_date)){
      setNewResError(new Error(`The resturant will be closed on ${formData.reservation_date} and all Tuesdays. Please choose another date.`))
    }else if(!checkTime(formData.reservation_time)){
      setNewResError(new Error(`A reservation can only be made between 10:30 AM and 9:30 PM.`))
    }else if(!inFuture()){
      setNewResError(new Error(`A reseration can only be made in the future`))
    }else{
      setNewResError(null);
    }
  }


    
   
  

    const handleChange = (event) => {
        const value =
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value;
        setFormData({
          ...formData,
          [event.target.name]: value,
        });
        loadError();
    }
    
    const handleCancel = () => {
        history.goBack();
    }

    const handleSubmit = async (event) => {
        const abortController = new AbortController();
        try{
        event.preventDefault();
        if(!checkDay(formData.reservation_date)){
          throw new Error(`The resturant will be closed on ${formData.reservation_date} and all Tuesdays. Please choose another date.`)
        }else if(!checkTime(formData.reservation_time)){
          throw new Error(`A reservation can only be made between 10:30 AM and 9:30 PM.`)
        }else if(!inFuture()){
          throw new Error(`A reservation can only be made in the future`)
        }else{
          setNewResError(null);
        }
        if(reservation_id){
            await updateReservation(reservation_id, formData, abortController.signal);
        }else{
            await createReservation(formData, abortController.signal)
        }
        setFormData(initialFormData);
        history.push(`/dashboard?date=${formData.reservation_date}`)
        }catch(error){
          setNewResError(error);
        }
        return () => abortController.abort();
    };

    const checkDay = (dateString) => {
        const date = new Date(`${dateString} 00:00`);
        return date.getDay() !== 2
      }
    
      const checkTime = (timeString) => {
        return (timeString > `10:30` && timeString < `21:30`)
      }
    
      const inFuture = () => {
        const date = new Date(`${formData.reservation_date} ${formData.reservation_time} CST`)
        return Date.now() < date.getTime()
      }

    return (
    <div>
      <ErrorAlert error={newResError} />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="first_name">First Name:</label>
          <input
            id="first_name"
            type="text"
            name="first_name"
            onChange={handleChange}
            value={formData.first_name}
            required
            size="18"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Last Name:</label>
          <input
            id="last_name"
            type="text"
            name="last_name"
            onChange={handleChange}
            value={formData.last_name}
            required
            size="18"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="mobile_number">Mobile Number:</label>
          <input
            id="mobile_number"
            type="tel"
            name="mobile_number"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            onChange={handleChange}
            value={formData.mobile_number}
            required
            size="18"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="reservation_date">Reservation Date:</label>
          <input
            id="reservation_date"
            type="date"
            name="reservation_date"
            min={onDate}
            onChange={handleChange}
            value={formData.reservation_date}
            required
            size="18"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="reservation_time">Reservation Time:</label>
          <input
            type="time"
            id="reservation_time"
            name="reservation_time"
            min="10:30"
            max="21:30"
            onChange={handleChange}
            value={formData.reservation_time}
            required
            size="18"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="people">People:</label>
          <input
            id="people"
            type="text"
            pattern="\d*"
            name="people"
            onChange={handleChange}
            value={formData.people}
            required
            size="18"
            className="form-control"
          />
        </div>
        <div className="d-flex flex-wrap justify-content-around mt-5">
          <button type="submit" className="btn btn-primary">submit</button>
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>cancel</button>
        </div>
      </form>
    </div>)
}