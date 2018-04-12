declare module server {
    interface Records {
        records_id?: number;
        schedule_id?: number;
        player_id?: number;
        team_id?: number;
        active?: boolean
        Y3?: number;
        N3?: number;
        Y2?: number;
        N2?: number;
        YP?: number;
        NP?: number;
        ARebounds?: number;
        DRebounds?: number;
        ast?: number;
        stl?: number;
        blk?: number;
        turnovers?: number;
        foul?: number;
        player_name?: string;
        jersey_number?: string
        //擴充屬性
        team_name?: string
    }
}