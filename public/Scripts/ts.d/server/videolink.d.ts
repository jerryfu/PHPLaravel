declare module server {
    interface VideoLink {
        video_id?: number;
        title?: string;
        day?: string;
        context?: string;
        url?: string;
        state?: string;
        //擴充屬性
    }
}