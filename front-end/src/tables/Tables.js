import Table from "./Table"

export default function Tables({loadDashboard, tables}){
    let listOfTables = tables.map((table) =>{
        
        return <Table loadDashboard={loadDashboard} tabl={table} key={table.table_id}/>
    })

    return (
        <div className="mt-5">
            <table className="table table-dark table-striped">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Table Name</th>
                        <th scope="col">Capacity</th>
                        <th scope="col">Status</th>
                        <th score="col">Finish</th>
                    </tr>
                </thead>
                <tbody>
                    {listOfTables}
                </tbody>
            </table>
        </div>
    )
}