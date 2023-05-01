import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { UserContext } from './Context'

export function Header(props) {
  let user=useContext(UserContext)
  return (
    <header >
      <div className='container flex justify-between align-center'>
        <NavLink to='/' style={{ fontSize: '2rem', fontWeight: '700', color: 'tomato' }}><i className="fa-sharp fa-solid fa-blog"></i>CONDUIT</NavLink>
        {props.isLogged ? <Authenticate User={user} /> : <NonAuthenticate />}
      </div>
    </header>
  )
}

function Authenticate({User}) {
  return (
    <nav className='flex align-center'>
      <li><NavLink to='/' activeclassname='active'>HOME</NavLink></li>
      <li> <NavLink to='/new-post' activeclassname='active'>NEW POST</NavLink></li>
      <li> <NavLink to='/setting' activeclassname='active'><i className="fa-solid fa-gear"></i> SETTING</NavLink></li>
      <li> <NavLink to={`/profiles/${User.username}`} activeclassname='active'>
        <div className='flex align-center'>
          <img src={User.image} alt={User.username}/>
          <span style={{marginLeft:'.5rem'}}>{User.username.toUpperCase()}</span>
        </div>
      </NavLink></li>
    </nav>
  )
}

function NonAuthenticate() {
  return (
    <nav className='flex'>
      <li><NavLink to='/' activeclassname='active'>HOME</NavLink></li>
      <li> <NavLink to='/signin' activeclassname='active'>SIGN IN</NavLink></li>
      <li> <NavLink to='/signup' activeclassname='active'>SIGN UP</NavLink></li>
    </nav>
  )
}