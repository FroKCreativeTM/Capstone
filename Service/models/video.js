const Sequelize=require('sequelize');

module.exports=class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            idvideo :{
                type:Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
           locations:{
                type:Sequelize.STRING(300),
                allowNull:false
            },
            starttime:{
                type:Sequelize.STRING(45),
                allowNull:false
            },
            endtime:{
                type:Sequelize.STRING(45),
                allowNull:false
            },
            fi_count:{
                type:Sequelize.INTEGER,
                allowNull:false
            },
            non_count:{
                type:Sequelize.INTEGER,
                allowNull:false
            },
            videodate:{
                type:Sequelize.STRING(45),
                allowNull:false
            },
            videoplace:{
                type:Sequelize.STRING(45),
                allowNull:false
            },
            },
            {
              sequelize,
              timestamps: false,
              underscored: false,
              modelName: 'video',
              tableName: 'video',
              paranoid: false,
              charset: 'utf8',
              collate: 'utf8_general_ci',
            });
    } static associate(db){}
};