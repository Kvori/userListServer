import sequelize from "../db.js"
import { DataTypes } from "sequelize"

export const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    name: {type: DataTypes.STRING},
    password: {type: DataTypes.STRING},
    block_status: {type: DataTypes.INTEGER, defaultValue: 0},
    last_login: {type: DataTypes.DATE}
})