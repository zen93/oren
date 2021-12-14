class Dishes {
    constructor() {
        this.dishes = [
            {
                type: 'dish',
                dish: 'Salad',
                price: 249,
                description: 'Tasty veggies with a dressing',
            },
            {
                type: 'dish',
                dish: 'Pasta',
                price: 360,
                description: 'Penne pasta in red or white sauce',
            },
            {
                type: 'dish',
                dish: 'Popcorn',
                price: 125,
                description: 'Salted popcorn',
            },
            {
                type: 'dish',
                dish: 'Soup',
                price: 200,
                description: 'Lentil soup',
            },
        ];
    
        this.beverages = [
            {
                type: 'drink',
                drink: 'Soft drink',
                price: 50,
                description: 'Any cold drink of your choice',
            },
            {
                type: 'drink',
                drink: 'Tea',
                price: 75,
                description: 'Masala chai',
            },
            {
                type: 'drink',
                drink: 'Coffee',
                price: 150,
                description: 'Cold coffee',
            },
        ];
    }

    getDishes = () => {
        return this.dishes;
    }
    
    getBeverages = () => {
        return this.beverages;
    }
}

module.exports = Dishes;