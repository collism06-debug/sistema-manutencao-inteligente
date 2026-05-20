class Order {
    static async count() {
        return 24;
    }

    static async countPending() {
        return 8;
    }

    static async countCompleted() {
        return 16;
    }
}

module.exports = Order;
