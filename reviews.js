var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

mongoose.Promise = global.Promise;

//mongoose.connect(process.env.DB, { useNewUrlParser: true });
try {
    mongoose.connect( process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true}, () =>
        console.log("connected"));
}catch (error) {
    console.log("could not connect");
}
//mongoose.set('setCreateIndex', true);
var ReviewSchema = new Schema({
    userID: {type: Schema.Types.ObjectID, ref: "UserSchema", required: true},
    movieID: {type: Schema.Types.ObjectID, ref: "MovieSchema", required: true},
    username: {type: String, required: true},
    quote: {type: String, required: true},
    rating: {type: Number, min: 1, max: 5, required: true},
    //imageUrl: {type: String}
});

ReviewSchema.pre('save', function(next){
    next();
});

module.exports = mongoose.model('Review', ReviewSchema);