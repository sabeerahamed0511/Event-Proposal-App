import React, { useState } from "react";
import { setCurrentUser, setToken } from "../../utills/storage-utills";
import { useNavigate } from "react-router-dom";
import { loginToAccount, registerAnAccount } from "../../utills/api-utill";

export default function RegisterForm({setIsLog}) {
    const navigate = useNavigate();
    const [option, setOption] = useState(true);
    const optionCSS = {
        fontWeight: "bold",
        color: "#4E94F4"
    };
    const [error, setError] = useState({
        email: "",
        password: ""
    });
    const [boo, setBoo] = useState(true);
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        contact: "",
        confirmPassword: ""
    })

    function onFormSubmit(e) {
        e.preventDefault();

        if(newUser.password !== newUser.confirmPassword) {
            return setError(ex => ({ ...ex, password: "Password & confirm password doesn't match!" }));
        }
        setBoo(false);
        // let formData = {...newUser};
        // if(option) {
        //     formData.isVendor = true;
        //     console.log(formData)
        // }
        // else {
        //     formData.isUser = true;
        //     formData.selected = [];
        //     console.log(formData)
        // }
        registerAnAccount(newUser, option? "vendor" : "user")
            .then(res => {
                if (res.status === "Success") {
                    setNewUser({
                        name: "",
                        email: "",
                        password: "",
                        contact: "",
                        confirmPassword: ""
                    });
                    setBoo(true);
                    setIsLog(true);
                }
                else {
                    setBoo(true);
                    if (res.field) setError(ex => ({ ...ex, [res.field]: res.message }));
                    else alert("Failed to log-in, try again!!");
                }
            })
    }

    return <>
        <div className="signin-form-container">
            <div className="option">
                <p className="vendor" style={option ? optionCSS : {}} onClick={() => setOption(true)}>
                    Vendor
                </p>
                <p className="user" style={!option ? optionCSS : {}} onClick={() => setOption(false)}>
                    User
                </p>
            </div>
            <form onSubmit={onFormSubmit}>
                <p className="heading">
                    Register in your Account
                </p>
                <div className="field-container reg">
                    <input type="text" id="name" placeholder="Name" required onChange={e => { setNewUser(ex => ({ ...ex, name: e.target.value })); }} />
                </div>
                <div className="field-container reg">
                    <input type="email" id="email" placeholder="Email" style={error.email ? { border: "1px solid red" } : {}} required onChange={e => {
                        setNewUser(ex => ({ ...ex, email: e.target.value }));
                        setError(ex => ({ ...ex, email: "" }));
                    }} />
                </div>
                {error.email && <span className="error">*{error.email}</span>}
                <div className="field-container reg">
                    <input type="number" id="number" placeholder="Contact" required max={9999999999} min={1000000000} onChange={e => { setNewUser(ex => ({ ...ex, contact: e.target.value })); }} />
                </div>
                <div className="field-container reg">
                    <input type="password" id="password" placeholder="Password" minLength={8} style={error.password ? { border: "1px solid red" } : {}} required onChange={e => {
                        setNewUser(ex => ({ ...ex, password: e.target.value }));
                        setError(ex => ({ ...ex, password: "" }));
                    }} />
                </div>
                {error.password && <span className="error">*{error.password}</span>}
                <div className="field-container reg">
                    <input type="password" id="confirmPassword" placeholder="Confirm Password" minLength={8} required onChange={e => { setNewUser(ex => ({ ...ex, confirmPassword: e.target.value })); }} />
                </div>
                <div className="btn-link-container reg">
                    <p className="createLink" onClick={() => setIsLog(true)}>Sign In</p>
                    <button type="submit">{boo ? "Register" : <span className="loader"></span>}</button>
                </div>
            </form>
        </div>
    </>
}