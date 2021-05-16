<<<<<<< HEAD
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
=======
const Sequelize=require('sequelize');

module.exports=class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            idusers :{
                type:Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            password:{
                type:Sequelize.STRING(20),
                allowNull:false
            },
            name:{
                type:Sequelize.STRING(10),
                allowNull:false
            },
            usertype:{
                type:Sequelize.BOOLEAN,
                allowNull:false
            },
            Dept:{
                type:Sequelize.STRING(10),
                allowNull:false
            },
            rank:{
                type:Sequelize.STRING(10),
                allowNull:false
            },
            tele:{
                type:Sequelize.STRING(20),
                allowNull:false
            },
            
            birth:{
                type:Sequelize.DATE,
                allowNull:false
            },
            addr:{
                type:Sequelize.STRING(45),
                allowNull:false
            }
            }, {
              sequelize,
              timestamps: false,
              underscored: false,
              modelName: 'User',
              tableName: 'users',
              paranoid: false,
              charset: 'utf8',
              collate: 'utf8_general_ci',
            });
    } static associate(db){}
>>>>>>> f2f9a69cc71d8439f6304a462bfc1e81c6bc8846
};