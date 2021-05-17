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
                type:Sequelize.STRING(300),
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
};