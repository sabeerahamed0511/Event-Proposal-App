import React, { useState,useEffect } from 'react'
import CardList from './CardList'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BASE_URL from "../../utills/api-utill";
import { getCurrentUser, getToken } from '../../utills/storage-utills';
import Scard from "./Scard";
import { useSelector } from 'react-redux';
import party2x from "../.././images/party2x.jpg";

const User = () => {
  const { list } = useSelector((state) => state.selected);
const navigate=useNavigate()
    const [items,setitems]=useState()
    const [lists, setlists] = useState([]);


    useEffect(() => {
      if(!getToken() || !getCurrentUser().isUser) return navigate("/");
      axios.get(`${BASE_URL}/proposal`).then((res) => {
        setitems(res.data.proposals);
      })
      .catch((err) => {
        alert(err.message);
      });


    axios
      .get(`${BASE_URL}/singleuser/${getCurrentUser()._id}`)
      .then((res) => {

        setlists(res.data.data.selected);
      })
      .catch((err) => alert(err.message));
  }, [list]);


  return (
    <div>
      <div>
        <img
          className="headerimg"
          src={party2x}
          alt="name"
        />
      </div>
      {lists.length > 0 ? (
        <>

          <div className="selcteddiv">
            {" "}
            <span className="selectedtext">Selected</span>
          </div>
          <div className="slistmain">
          {lists.map((lis) => (
            <div className="slist">
                <Scard items={lis} />
            </div>
          ))}
          </div>
        </>
      ) : null}
      <div className="proposals">
        <p>Proposals</p>
      </div>
      <div className="eventlists">
        {items ? <CardList items={items} /> : null}
      </div>
    </div>
  );
};

export default User;
