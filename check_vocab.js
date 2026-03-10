const mongoose = require('mongoose');
const Vocabulary = require('./server/models/Vocabulary');

mongoose.connect('mongodb://localhost:27017/linguasetu')
    .then(async () => {
        console.log("Connected");
        const count = await Vocabulary.countDocuments();
        console.log("Vocabulary count:", count);
        if (count > 0) {
            const sample = await Vocabulary.findOne();
            console.log("Sample:", sample);
        }
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
