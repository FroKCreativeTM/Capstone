const Sequelize=require('sequelize');

module.exports=class crime extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            idcrime :{
                type:Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            locations:{
                type:Sequelize.STRING(300),
                allowNull:false
            },
            pred_type:{
                type:Sequelize.STRING(15),
                allowNull:false
            },
            fi_percent:{
                type:Sequelize.FLOAT,
                allowNull:false
            },
            non_percent:{
                type:Sequelize.FLOAT,
                allowNull:false
            },
            },
            {
              sequelize,
              timestamps: false,
              underscored: false,
              modelName: 'crime',
              tableName: 'crime',
              paranoid: false,
              charset: 'utf8',
              collate: 'utf8_general_ci',
            });
    } 
static associate(db) {
        db.crime.belongsTo(db.video, { foreignKey: "locations", targetKey: "locations" });
      }
};