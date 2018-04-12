interface PackOption {
    option_team: SchOption[]
    option_play_name: server.PlayName[]
    option_site: server.Site[]
}

interface SchOption {
    plan_name?: string;
    play_name_id?: number;
    team?: SchTeamOption[]
}

interface SchTeamOption {
    area_sn?: string;
    divide_name?: string;
    team_id?: number;
    team_name?: string
}