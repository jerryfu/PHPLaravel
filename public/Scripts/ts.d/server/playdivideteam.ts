declare module server {
    interface PlayDivideTeam {
        play_divide_team_id?: number;
        play_divide_id?: number;
        team_id?: number;
        sort?: number;
        //擴充屬性
        team_name?: string
    }
}