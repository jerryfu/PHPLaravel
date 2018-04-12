interface RecordReturn {
    schedule_id: number
    field: server.Schedule
    home: RecordUnit
    visiting: RecordUnit
}

interface RecordUnit {
    team_id: number,
    team_name: number,
    data: Array<server.Records>
}