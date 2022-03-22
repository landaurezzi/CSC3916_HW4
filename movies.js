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
mongoose.set('useCreateIndex', true);

//movie schema
var MovieSchema = new Schema({
    Title: {type: String, required: true},
    YearReleased: {type: String, required: true},
    genre: {
        type: String,
        required: true,
        enum: ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Thriller'],
    },
    //add validation to pass at least three actors
    Actors: [
        {ActorName: {type: String, required: true}, CharacterName: {type: String, required: true}},
        {ActorName: {type: String, required: true}, CharacterName: {type: String, required: true}},
        {ActorName: {type: String, required: true}, CharacterName: {type: String, required: true}}
    ]
    /*
    Movie.findOneAndUpdate(req.body.find_Title, req.body.update_Title, function(err, movie)
    */
});

MovieSchema.pre('save', function(next) {
    next();
});

//export MovieSchema
module.exports = mongoose.model('Movie', MovieSchema);