const User = require('./User');
const Activity = require('./activity');
const City = require('./city');


User.belongsToMany(City, {
  through: {
    model: Activity,
    unique: false
  },
  as: 'planned_trips'
});

City.belongsToMany(User, {
  through: {
    model: Activity,
    unique: false
  },
  as: 'city_users'
});



module.exports = { User, Activity, City };

