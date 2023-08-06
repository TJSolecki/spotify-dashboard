import { useState, useEffect } from "react";
import Login from "./views/Login.tsx";
import Dashboard from "./views/Dashboard.tsx";
import axios from "axios";
function App() {
  const [auth, setAuth] = useState<boolean>(false);
  useEffect(() => {
    axios.get('/check-auth')
      .then(({data}) => {
        if (data?.isAuth) {
          return setAuth(true);
        }
        setAuth(false);
      })
  }, [])

  return (
    <div className="App">
      {!auth ? <Login/> : <Dashboard/>}
    </div>
  );
}

export default App

