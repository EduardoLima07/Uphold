function GetSellProfit(sellRevenue, buyRevenue){
    try {
        profitSell = ((sellRevenue - buyRevenue)/buyRevenue) * 100;
        return profitSell;
    } catch (error) {
        
    }
};

function GetBuyProfit(lastSellingPrice, bidPrice){
    try {
        profitBuy = ((lastSellingPrice - bidPrice)/bidPrice) * 100;
        return profitBuy;
    } catch (error) {
        
    }
};

module.exports.GetBuyProfit = GetBuyProfit;
module.exports.GetSellProfit = GetSellProfit;