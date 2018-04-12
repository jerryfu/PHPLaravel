declare module server {
    interface Schedule {
        sno?: string;
        schedule_id?: number;
        set_date?: string;
        home_team_id?: number;
        visiting_team_id?: number;
        site_id?: number;
        play_name_id?: number;
        state?: string;
        //擴充屬性

        site_name?: string;
        home_team?: string;
        visiting_team?: string
        area_sn?: string;
        divide_name?: string;

        hasRecords?: boolean;
    }
}