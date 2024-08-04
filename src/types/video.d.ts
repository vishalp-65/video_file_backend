export interface VideoAttributes {
    id?: string;
    url: string;
    filename: string;
    mimetype: string;
    size: number;
    duration: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface VideoInstance
    extends Sequelize.Model<VideoAttributes>,
        VideoAttributes {}
