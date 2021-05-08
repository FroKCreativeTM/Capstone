const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            name:{
                type: Sequelize.STRING(40),
                allowNull: false,
                unique: false,
            },
            id:{
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            provider: {
                type: Sequelize.STRING(10),
                allowNull: false,
                defaultValue: 'local',
            } 
        }, {
            sequelize,
            timeStamp: true,
            underscored: false,
            modelName: 'User',
            tableName:'users',
            paranoid: true,
            charset:'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db){}
};