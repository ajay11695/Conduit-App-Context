
function Pagination(props){
    let {articlePerPage,articlesCount,activePageIndex,currentPageIndex}=props
    let pages=[]
    let noOfpages=Math.ceil(articlesCount/articlePerPage)
    for(let i=1;i<=noOfpages;i++){
        pages.push(i)
    }

    return (
        <div className="flex align-center justify-center pagination">
            <p onClick={()=>{currentPageIndex(activePageIndex-1<1?1:activePageIndex-1)}}>Prev</p>
            <div className="pagination-count">
            {pages.map(page=><span id={`page${page}`} key={page} className={activePageIndex===page?'activePage':''} onClick={()=>{currentPageIndex(page)}}>{page}</span>)}
            </div>
            <p onClick={()=>{currentPageIndex(activePageIndex+1>noOfpages?noOfpages:activePageIndex+1)}}>Next</p>
        </div>
    )

}

export default Pagination