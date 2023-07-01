const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const axios = require('axios');

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected')
});

const sample = array => array[Math.floor(Math.random() * array.length)]

async function seedImgs() {
    try {
        const resp = await axios.get('https://api.unsplash.com/photos/random', {
            params: {
                client_id: 'm3Ci98AWANLyzv6LgddkMl6CKoaLQ6Zt-ZgzOPNSPSU',
                collections: 1114848,
                count: 30
            },
        })
        return resp.data.map((a) => a.urls.small)
    } catch (err) {
        console.error(err)
    }
}

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 30; i++) {
        const random1000 = Math.floor(Math.random() * cities.length)
        const imgs = await seedImgs()
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: '64920ae336fda34b27881e4d', // admin acc => user: admin, password: admin
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)} `,
            //image: sample(imgs),
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio pariatur neque eos porro commodi vero totam magnam ea praesentium dolores obcaecati accusantium modi itaque, non nesciunt unde optio maiores doloribus.',
            price: price,
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dis4zevhz/image/upload/v1687403040/samples/landscapes/nature-mountains.jpg',
                    filename: 'samples/landscapes/nature-mountains.jpg'
                }
            ]
        })
        await camp.save();
    }
    console.log('Done seeding database!');
}

seedDB()
    .then(() => {
        mongoose.connection.close()
    })