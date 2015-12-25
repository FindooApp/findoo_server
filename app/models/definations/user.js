var util = require('../../helper/util')

module.exports = {
  get : function(DataTypes){
    return {
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      isVerified : DataTypes.BOOLEAN
    };
  },
  associate : function(models){

  }
}
