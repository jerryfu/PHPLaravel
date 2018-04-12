declare module server {
    interface Sponsor {
        sponsor_id?: number;
        title?: string;
        url?: string;
        context?: any;
        sort?: number;
        state?: string;
        ins_id?: string;
        ins_date?: Date;
        upt_id?: string;
        upt_date?: Date;
        lang?: string;
        //擴充屬性
    }
}