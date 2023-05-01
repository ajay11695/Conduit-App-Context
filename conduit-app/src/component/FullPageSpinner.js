import '../stylesheet/loader.css'

export function FullPageSpinner() {
    return (
        <div className="bouncing-loader" style={{height:'100vh'}}>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}