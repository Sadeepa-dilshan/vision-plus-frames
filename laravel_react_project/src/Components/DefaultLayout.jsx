import axios from "axios";
import { useEffect } from "react";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/contextprovider";
import { Link } from "react-router-dom";

export default function DefaultLayout(){
    const {user, token, setUser, setToken} = useStateContext();
    if(!token){
       return <Navigate to='/login'/>
    }
    
    const onLogout =  (ev) =>{
        ev.preventDefault();
        axiosClient.get('/logout')
        .then(({}) => {
           setUser(null)
           setToken(null)
        })
    }

    useEffect(() => {
        axiosClient.get('/user')
          .then(({data}) => {
             setUser(data)
          })
      }, [])

    return(
        <div id="defaultLayout">
         <div className="content">
            <header>
                <div>
                    Header
                </div>
                <div>
                        <Link to="/brands">View All Brands</Link> {/* Link to the brand index page */}
                        <Link to="/brands/new">Create New Brand</Link> {/* Link to create a new brand */}
                        <Link to="/codes">View All Codes</Link> {/* Link to the CodeIndex page */}
                        <Link to="/codes/new">Create New Code</Link>
                        <Link to="/colors">View All Colors</Link> {/* Link to the ColorIndex page */}
                        <Link to="/colors/new">Create New Color</Link> {/* Link to the ColorCreate page */}
                        <Link to="/frames/new">Create New Frame</Link> {/* Link to the FrameCreate page */}
                    </div>
                <div>
                    {user.name}
                    <a href="#" onClick={onLogout} className="btn-logout"> Logout</a>
                </div>
            </header>
            <main>
            <Outlet />
            </main>
            </div>
        </div>
    )
}