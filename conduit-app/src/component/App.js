import { Routes, Route, useNavigate } from "react-router-dom";
import { Header } from "./Header";
import Home from "./Home";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { NoMatch } from "./NoMatch";
import SingleArticle from "./SingleArticle";
import { useEffect, useState } from "react";
import { localStorageKey } from "../utils/constant";
import { userVerifyURL } from "../utils/constant";
import { FullPageSpinner } from "./FullPageSpinner";
import NewPost from "./NewPost";
import Setting from "./Setting";
import Profile from "./Profile";
import EditPost from "./EditPost";
import ErrorBoundary from "./ErrorBoundary";
import { UserContext } from "./Context";

function App() {
  let [isLogged, setIsLogged] = useState(false)
  let [user, setUser] = useState(null)
  let [isVerifying, setIsVerifying] = useState(true)
  let navigate=useNavigate()

  useEffect(() => {
    let key = localStorage[localStorageKey]
    if (key) {
      fetch(userVerifyURL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Token ${key}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then(({ errors }) => {
              return Promise.reject(errors)
            })
          }
          return res.json();
        })
        .then(({ user }) => {
          updateUser(user)
        }).catch(errors => console.log(errors))

    } else {
      setTimeout(() => setIsVerifying(false), 1000)
    }
  }, [])

  function updateUser(userDetail) {
    setIsLogged(true)
    setUser(userDetail)
    setIsVerifying(false)
    localStorage.setItem(localStorageKey, userDetail.token)
  }

  const handleLogout=()=>{
    localStorage.clear()
    setIsLogged(false)
    setUser(null)
    navigate('/')
  }


  if (isVerifying) {
    return <FullPageSpinner />
  }

  return (
    <UserContext.Provider value={user}>
      <Header  isLogged={isLogged} />
      <ErrorBoundary>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/profiles/:username' element={<Profile />} />
          <Route path='/article/:slug' element={<SingleArticle  />} />
          <Route path='*' element={<NoMatch />} />
          <Route path='/new-post' element={<NewPost />} />
          <Route path='/article/:slug/edit' element={<EditPost />} />
          <Route path='/setting' element={<Setting updateUser={updateUser} handleLogout={handleLogout}/>} />
          <Route path='/signin' element={<SignIn updateUser={updateUser} />} />
          <Route path='/signup' element={<SignUp updateUser={updateUser} />} />
        </Routes>
      </ErrorBoundary>
    </UserContext.Provider>
  );
}


export default App;
