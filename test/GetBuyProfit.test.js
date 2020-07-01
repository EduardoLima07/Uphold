const app = require("../functions");
const { TestResult } = require("@jest/types");

test('should be defined', () => {
    try {
        expect(app.GetBuyProfit).toBeDefined()
    } catch (error) {
        console.log(error)
    }
    
}) 

test('given 2000 as ask and 1000 as bid', () => {
    expect(app.GetBuyProfit(2000,1000)).toBe(100)
})