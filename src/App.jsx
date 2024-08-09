
import { useRef, useState } from 'react'
import './App.css'
import { useEffect } from 'react'
import Pill from './component/Pill'

function App() {
  const [searchTerm,setSearchTerm]=useState("")
  const[suggestion,setSuggestion]=useState([])
  const[selectedUser,setSelectedUser]=useState([])
  const[selectedUserSet,setSelectedUserSet]=useState(new Set())
  //https://dummyjson.com/users/search?q=John

const InputRef=useRef(null)

useEffect(()=>{
  const fetchUser = () => {
    if(searchTerm.trim()===""){
     setSuggestion([])
     return;
    }
    fetch(`https://dummyjson.com/users/search?q=${searchTerm}`)
    .then((res)=>res.json())
    .then((data)=>setSuggestion(data))
    .catch((err)=>{
     console.log(err)
    })
   }
   
 fetchUser()
},[searchTerm])
const handleSelectUser=(user)=>{
setSelectedUser([...selectedUser,user])
setSelectedUserSet(new Set([...selectedUserSet,user.email]))
setSearchTerm("")
setSuggestion([])
InputRef.current.focus()

}

const handleRemoveUser =(user)=>{
 const updatedUsers =selectedUser.filter(
  (selectedUser)=>selectedUser.id!==user.id 
 )
 setSelectedUser(updatedUsers)
 const updatedEmail = new Set(selectedUserSet)
  updatedEmail.delete(user.email)
  setSelectedUserSet(updatedEmail)
 
}
const handleKeyDown=(e)=>{
  if(e.key ==='Backspace'&&e.target.value===""&&selectedUser.length>0){
    const lastUser=selectedUser[selectedUser.length-1]
    handleRemoveUser(lastUser)
    setSuggestion([])
  }
}

  return(
  <div className='user-search-container'>
  <div className="user-search-input">
    {/* Pills */}
    {
      selectedUser.map((user)=>{
        return ( <Pill key={user.email} 
        image={user.image}
        text={`${user.firstName} ${user.lastName}`}
        onClick={()=>handleRemoveUser(user)}
        />
        )
      })
    }
        {/*input field with search suggestion */}
    <div>
    <input ref={InputRef} type="text" value={searchTerm} 
    onChange={(e)=>setSearchTerm(e.target.value)}
    placeholder='Search for a User....'
    onKeyDown={handleKeyDown}
    />
    {/* Search Suggestion */}
    <ul className="suggestion-list">{suggestion?.users?.map((user,index)=>{
 return  !selectedUserSet.has(user.email)?(  <li key={user.email} onClick={()=>handleSelectUser(user)}>
  <img src={user.image} alt={`${user.firstName} ${user.lastName}`} />
  <span>
    {user.firstName} {user.lastName}
  </span>
   </li>

    ):(<></>)
    })}</ul>
    </div>
  </div>
  </div>
)
}

export default App
