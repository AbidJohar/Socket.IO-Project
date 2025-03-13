import React, { useState } from 'react'

const FormPage = () => {

     const [username, setUsername]=useState('')
     const [email, setEmail]=useState('')
     const [password, setPassword]=useState('')


     const handlesubmit = (e)=>{
         e.preventDefault;
         
         const userValue = {
            username: username,
            email: email,
            password:password
         }
         console.log("user value:",userValue);
         
        
     }
  return (
    <div>
        <form action="submit">
           <input onChange={(e)=> setUsername(e.target.value)} type="text" name="username" value={username} />
           <input onChange={(e)=> setEmail(e.target.value)} type="email" name="email" value={email} />
           <input onChange={(e)=> setPassword(e.target.value)} type="password" name="password" value={password} />
           <button
           onClick={handlesubmit}
           >submit</button>
        </form>
      
    </div>
  )
}

export default FormPage
