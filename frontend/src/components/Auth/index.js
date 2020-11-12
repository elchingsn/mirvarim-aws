import React, { useState, useContext} from "react";
import { Link, useHistory } from "react-router-dom";

import { UserContext } from "App.js"
import withRoot from "../../withRoot";
import Login from "./Login";
import Register from "./Register";



export default withRoot(( {setLoginOpen} ) => {
  const currentUser = useContext(UserContext);
  const history = useHistory();
  console.log(currentUser)
  if (currentUser !== undefined) {
    if(window.location.pathname.includes('login')){
      history.push('/');
    } else if(window.location.pathname.includes('partner')) {
      history.push(`/partner/${currentUser.id}`);
    }
  } 
    
  return <AuthForm setLoginOpen={setLoginOpen} />
});

const AuthForm = ( {setLoginOpen} ) => {
  const [newUser, setNewUser] = useState(false);

  return newUser ? (
    <Register setNewUser={setNewUser} setLoginOpen={setLoginOpen}/>
  ) : (
    <Login setNewUser={setNewUser} setLoginOpen={setLoginOpen}/>
  );
}