// Generate a random user
function generateUser() {
    const maxDOBDate = new Date();
    maxDOBDate.setFullYear(maxDOBDate.getFullYear() - 16);

    const user = new User({
        status: faker.random.arrayElement(['active', 'blocked', 'pending']),
        plan: mongoose.Types.ObjectId(), // get free plan
        setting: {
            language: faker.random.arrayElement(['en']),
            isActive: faker.random.boolean(),
        },
        email: faker.internet.email(),
        mobile: faker.phone.phoneNumber(),
        name: faker.name.findName(),
        gender: faker.random.arrayElement(['male', 'female', 'other']),
        image: faker.image.avatar(),
        interestedIn: faker.random.arrayElement(['male', 'female', 'other']),
        age: faker.random.number({ min: 16, max: 40 }),
        dateOfBirth: faker.date.between(new Date(1651561561), maxDOBDate),
        onboardStep: faker.random.number({ min: 1, max: 5 }),
        heartId: faker.random.number({ min: 1000000, max: 9999999 }).toString(),
        fcmToken: faker.random.uuid(),
        referralCode: faker.random.alphaNumeric(9),
        location: {
            type: 'Point',
            coordinates: [faker.address.longitude(), faker.address.latitude()],
        },
    });

    return user;
}

// Generate a random location within a specific range
function generateRandomLocation(center, radiusInMeters) {
    const getRandomCoordinateOffset = (radiusInMeters) => (Math.random() * radiusInMeters) * (Math.random() > 0.5 ? 1 : -1);

    const { latitude, longitude } = center;
    const earthRadiusInMeters = 6371000;

    const latOffset = getRandomCoordinateOffset(radiusInMeters) / earthRadiusInMeters;
    const lonOffset = getRandomCoordinateOffset(radiusInMeters) / (earthRadiusInMeters * Math.cos(Math.PI * latitude / 180));

    const newLat = latitude + latOffset * (180 / Math.PI);
    const newLon = longitude + lonOffset * (180 / Math.PI);

    return { type: 'Point', coordinates: [newLon, newLat] };
}

// Generate random Rings data
function generateRingsData(count) {
    const ringsData = [];

    for (let i = 0; i < count; i++) {
        const sender = mongoose.Types.ObjectId(); // set sender id
        const receiver = mongoose.Types.ObjectId(); // set receiver id
        const center = { latitude: faker.address.latitude(), longitude: faker.address.longitude() };
        const location = generateRandomLocation(center, 1000); // Radius of 1000 meters around the center point

        const rings = new Rings({
            sender,
            receiver,
            location,
            senderVisibility: faker.random.boolean(),
            receiverVisibility: faker.random.boolean(),
        });

        ringsData.push(rings);
    }

    return ringsData;
}


// Generate multiple users
function generateUsers(count) {
    const users = [];
    for (let i = 0; i < count; i++) {
        const user = generateUser();
        users.push(user);
    }
    return users;
}



