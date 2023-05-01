
function Pagination(props) {
    let { limit, articlesCount, offset, handleCurrentPageIndex } = props
    let pages = []
    let noOfpages = Math.ceil(articlesCount / limit)
    for (let i = 1; i <= noOfpages; i++) {
        pages.push(i)
    }

    return (
        <div className="flex align-center justify-center pagination">
            <div className="pagination-count">
                {pages.map(page => <span id={`page${page}`} key={page} className={offset + 10 === page * 10 ? 'activePage' : ''} onClick={() => { handleCurrentPageIndex(page) }}>{page}</span>)}
            </div>
        </div>
    )

}

export default Pagination