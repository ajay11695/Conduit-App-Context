import { Link } from "react-router-dom"
import { UserContext } from "./Context"
import { useContext } from "react"


function FeedNav(props) {
  let { activeTab, addTab } = props
  const user = useContext(UserContext)
  return (
    <nav className="feedNav">
      <ul className="flex">

        {user &&
          <li onClick={() => addTab(user.username)}>
            <Link to='/'
             className={activeTab===user.username?'activeTab':''}
            >Your Feed</Link>
          </li>
        }

        <li onClick={() => addTab('global')}>
          <Link to='/'
          className={activeTab===''?'activeTab':''}
          >Global Feed</Link>
        </li>

        {
          user ?
            activeTab !== user.username && activeTab !== '' &&
            <li>
              <Link className={activeTab && 'activeTab'}># {activeTab}</Link>
            </li>
            :
            activeTab !== '' &&
            <li>
              <Link className={activeTab && 'activeTab'}># {activeTab}</Link>
            </li>
        }
      </ul>
      <hr></hr>
    </nav>
  )
}

export default FeedNav