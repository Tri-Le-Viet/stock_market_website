export default function paginationSettings(gridApi) {
    return(
    <div className="page_size">Page Size:&nbsp;
        <select defaultValue="10" onChange={(e) => {gridApi.paginationSetPageSize(Number(e.target.value))}} id="page_size">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
        </select>
    </div>
    )
}