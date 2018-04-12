declare module server {
    interface Player {
        player_id?: number;
        idno?: string;
        player_name?: string;
        team_id?: number;
        state?: string;
        jersey_number?: string
        height?: number;
        weight?: number;
        birthday?: string;
        description?: string
        positions?: string;
        address?: string
        tel?: string
        //擴充屬性
        team_name?: string
    }
}