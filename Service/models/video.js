const Sequelize=require('sequelize');

module.exports=class Vidio extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            idvideo :{
                type:Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            locations:{
                type:Sequelize.STRING(300),
                unique : true,
                allowNull:false
            },
            starttime:{
                type:Sequelize.STRING(45)
            },
            endtime:{
                type:Sequelize.STRING(45)
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
                type:Sequelize.STRING(45)
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
    } 
    static associate(db) {
        db.video.hasMany(db.crime, { foreignKey: "locations", sourceKey: "locations" });
      }
};