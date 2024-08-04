import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { VideoAttributes } from "../types/video";

interface VideoCreationAttributes extends Optional<VideoAttributes, "id"> {}

class Video
    extends Model<VideoAttributes, VideoCreationAttributes>
    implements VideoAttributes
{
    public id!: string;
    public url!: string;
    public filename!: string;
    public mimetype!: string;
    public size!: number;
    public duration!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite",
});

Video.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        filename: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mimetype: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        duration: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "videos",
        timestamps: true,
    }
);

export default Video;
