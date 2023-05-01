import { Link } from "react-router-dom"

function FeedNav(props){
    let {activeTab,activeloginTab,currentUser}=props
  return(
    <nav className="feedNav">
        <ul className="flex">

           {currentUser && 
           <li onClick={()=>{props.removeTab('yourfeed')}}>
               <Link to='/' className={activeloginTab==='yourfeed'?'activeTab':''}>Your Feed</Link>
            </li>
            }
            <li onClick={()=>{props.removeTab('global')}}>
               <Link to='/' className={activeloginTab==='global'?'activeTab':''}>Global Feed</Link>
            </li>
            {activeTab && 
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