const plans = [
    {
        name: 'Free Plan',
        description: 'Restriction to view "Person details who likes You", Restriction to view "You both like each other or not", Restriction to "Chats"',
        amount: 0,
        currency: 'USD',
        planType: 'free',
        noOfDays: 2000,
    },
    {
        name: 'Referral Plan',
        description: 'Access to view "Person details who likes You", Restriction to view "You both like each other or not", Restriction to "Chats"',
        amount: 0,
        currency: 'USD',
        planType: 'referral',
        noOfDays: 2,
    },
    {
        name: 'Heart Plan',
        description: 'Access to view "Person details who likes You", Access to view "You both like each other or not", Access to "Chats"',
        amount: 20,
        currency: 'USD',
        planType: 'subscription',
        noOfDays: 28,
    },
    {
        name: "Love Plan",
        description: 'Access to view "Person details who likes You", Access to view "You both like each other or not", Access to "Chats"',
        amount: 50,
        currency: 'USD',
        planType: 'subscription',
        noOfDays: 84,
    },
]

module.exports = { plans }