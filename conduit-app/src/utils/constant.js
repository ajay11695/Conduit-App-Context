const ROOT_URL=`https://conduit.productionready.io/api`;
const articlesURL=ROOT_URL+'/articles';
const tagsURL=ROOT_URL+`/tags`;
const signUpURL=ROOT_URL+`/users`;
const loginURL=ROOT_URL+`/users/login`;
const userVerifyURL=ROOT_URL+`/user`;
const updateUserURL=ROOT_URL+`/user`;
const getProfileURL=ROOT_URL+`/profiles/`;

const localStorageKey='app_user'

const fetchArticles = async (data, setData, activeTab, auth) => {

    try {
        const response = await fetch(`${articlesURL + '?offset=' + data.offset + '&limit=' + data.limit}${auth.user ?
            activeTab !== '' && activeTab !== auth.user.username ? '&tag=' + activeTab : ''
            :
            activeTab !== '' ? '&tag=' + activeTab : ''
            }${auth.user && activeTab === auth.user.username ? '&author=' + activeTab : ''}`
            , {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${auth.user ? auth.user.token : ''}`
                }
            })
        if (!response.ok) {
            throw new Error("Network response was not ok")
        }
        const json = await response.json()
        setData(prevState => ({ ...prevState, ...json }))

    } catch (error) {
        setData(prevState => ({ ...prevState, articlesErr: error.message }))
    }
}

export {ROOT_URL,articlesURL,tagsURL,signUpURL,loginURL,localStorageKey,userVerifyURL,updateUserURL,getProfileURL,fetchArticles};