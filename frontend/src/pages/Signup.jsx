import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = () => {

    const nav = useNavigate();

    const [form, setForm] = useState({
        name : "",
        email : "",
        password : ""
    })

    const submit = async (e) => {
        e.preventDefault();
        await AudioParam.post('/auth/signup', form);
        alert("Signup success");
        nav('/login');
    }

  return (
    <>
        <div className='h-screen flex justify-center items-center'>
            <form onSubmit={submit}>
                <h2>Signup</h2>

                <input className='border p-2'
                    placeholder='Name'
                    onChange={(e) => setForm({...form, name:e.target.value})}/>

                <input className='border p-2'
                    placeholder='Email'
                    onChange={(e) => setForm({...form, email:e.target.value})}/>

                <input className='border p-2'
                    placeholder='Password'
                    onChange={(e) => setForm({...form, password:e.target.value})}/>

                <button className="bg-blue-500 p-2"
                >Signup</button>
            </form>
        </div>
    </>
  )
}

export default Signup