const Sequelize=require('sequelize');

module.exports=class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            idcrime :{
                type:Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
           check:{
                type:Sequelize.BOOLEAN,
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
    } static associate(db){}
};