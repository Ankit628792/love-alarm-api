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


const plansNew = [
    {
        id: 0,
        name: 'Free Plan',
        description: `Modify profile settings without limitation, Access to "Whose alarm you have rang, No limitation to ring Love Alarm`,
        amount: 0,
        currency: 'USD',
        noOfDays: 1000,
        planType: 'free',
        colors: ['#FFFFFF', '#FFFFFF']
    },
    {
        id: 1,
        name: 'Heart Plan',
        description: `Access to "Who you have ring alarm", Can see "Person who rings your alarm", View "You both rings each other's alarm or not", "Chats" screen`,
        amount: 20,
        currency: 'USD',
        noOfDays: 28,
        planType: 'subscription',
        colors: ['#FFFCFF', '#D7FFFE']
    },
    {
        id: 2,
        name: 'Love Plan',
        description: `Access to "Who you have ring alarm", Can see "Person who rings your alarm", View "You both rings each other's alarm or not", "Chats" screen`,
        amount: 50,
        currency: 'USD',
        noOfDays: 84,
        planType: 'subscription',
        colors: ['#FFFCFF', '#D7FFFE']
    },
    {
        id: 3,
        name: 'Referral Plan',
        description: `Can see "Person who rings your alarm", Restriction to view "You both rings each other's alarm or not", Restriction to "Chats"`,
        amount: 0,
        currency: 'USD',
        noOfDays: 2,
        planType: 'referral',
        colors: ['#FFFCFF', '#FFF4FF', '#FFE6FA']
    }
]

module.exports = { plans }