declare module server {
    interface Album {
        album_id?: number;
        title?: string;
        url?: string;
        context?: any;
        sort?: number;
        state?: string;
        set_date?: string;
        ins_id?: string;
        ins_date?: Date;
        upt_id?: string;
        upt_date?: Date;
        lang?: string;
        //擴充屬性
    }
}