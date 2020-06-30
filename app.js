import { get } from 'axios';
import { scheduleJob } from 'node-schedule';
import { } from 'node-readme';
import { setData } from "./Postgres";
import { writeFile } from "./file";
import BotData from "./botData";

let firstBtc = 0;
let idBtc = 0;
const MyBtcs = [];
let id = 0;
let lastSellingPrice = 0;
let sql = "";



function CreateBot(){
    try {
        
        // sql = "SELECT * FROM BOT WHERE BOTNAME = 'Eduardo'";
        // let bot = Postgres.x(sql).then(function(result) {
        //     console.log(result) // "Some User token"
        //  });
        //var x = Postgres.GetValue();

        // console.log(bot);
        // if(bot){
        //     return;
        // }else{
            const BotData1 = new BotData("Eduardo", "Braga", "ealima.7@gmail.com","910055284","USD","0","0");
            //console.log(BotData1);

            sql = "INSERT INTO bot(botname, botaddress, botemail, botcontact, botcurrency, botbalance, botwallet) VALUES ('Eduardo', 'Braga', 'ealima.7@gmail.com','910055284','USD',0,0);"
            setData(sql);

            console.log("Hello", BotData1.name);
            console.log("");
            console.log("-----YOUR TRANSACTIONS-----")
        // }
    } catch (error) {
        
    }
}

const GetFirstBtc = async () => {
	try {
		const data = await get('https://api.uphold.com/v0/ticker/BTCUSD');
        firstBtc = data.data.bid;
        idBtc++;
		MyBtcs.push({
			ID: idBtc,
			value: firstBtc,
        });

        lastSellingPrice = data.data.ask;

        const transdesc = 'Bought first BTC by: ' + firstBtc;
        var transdate =  new Date();
        transdate = transdate.toJSON().substr(0,10);

        sql = "INSERT INTO transactions(transtype, transdesc, transvalue, transprofit, transdate) VALUES (1, '" + transdesc + "', "+ firstBtc +", 0 , '"+ transdate + "')";
        setData(sql);

        console.log("");
        console.log("BID:", data.data.bid);
        console.log("ASK:", data.data.ask);
        console.log("You have now purchased your first BTC for", firstBtc,"€");

		return data.data.bid;
	} catch(error) {
		console.log(error);
	}
};

function GetSellProfit(sellRevenue, buyRevenue){
    try {
        profitSell = ((sellRevenue - buyRevenue)/buyRevenue) * 100;
        return profitSell;
    } catch (error) {
        
    }
}

function GetBuyProfit(lastSellingPrice, bidPrice){
    try {
        profitBuy = ((lastSellingPrice - bidPrice)/bidPrice) * 100;
        return profitBuy;
    } catch (error) {
        
    }
}

CreateBot();
GetFirstBtc();

scheduleJob('*/5 * * * * *', async () => {
	try {

        const data = await get('https://api.uphold.com/v0/ticker/BTCUSD');

        const currentAsk = data.data.ask;
        const currentBid = data.data.bid;

        console.log("");
        console.log("BID:", data.data.bid);
        console.log("ASK:", data.data.ask);
              
        for (let index = 0; index < MyBtcs.length; index++) {
            
            let profitSell = GetSellProfit(currentAsk, MyBtcs[index].value)
            
            if(profitSell > 5){
            
                writeFile('Sell', 'Profit of ' + profitSell + '.  Moving 1 BTC to USD');
                sql = "INSERT INTO transactions(transtype, transdesc, transvalue, transprofit, transdate) VALUES (2, 'Moving 1 BTC to USD', "+ data.data.ask +", "+ profitSell +" , '"+ new Date().toJSON().substr(0,10) + "')";
                setData(sql);
                MyBtcs.slice(index,1);

                console.log(""); 
                console.log("INTENT TO SELL");
                console.log("Your sell profit is over 5%, more precisely", profitSell);
                console.log("1 BTC sold for the price of", currentAsk,"€");
                console.log("You have now", MyBtcs.length,"BTC's");

            
            }else{
                           
                writeFile('Sell', 'Profit of ' + profitSell + '.  No action performed');

                console.log("");
                console.log("INTENT TO SELL");
                console.log("Your sell profit is below 5%, more precisely", profitSell);
                console.log("It's not worth to sell at this rate");
                console.log("You have now", MyBtcs.length,"BTC's");
          
            }
        }

        let profitBuy = GetBuyProfit(lastSellingPrice, data.data.bid);

        if(profitBuy > 5){
            
            MyBtcs.push({
                ID: idBtc,
                value: data.data.bid
            });

            idBtc++;

            writeFile('Buy', 'Profit of ' + profitBuy + '.  Buying 1 BTC');

            sql = "INSERT INTO transactions(transtype, transdesc, transvalue, transprofit, transdate) VALUES (1, 'Buying 1 BTC', "+ data.data.bid +", "+ profitBuy +" , '"+ new Date().toJSON().substr(0,10) + "')";
            setData(sql);
            
            console.log("");
            console.log("INTENT TO BUY");
            console.log("Your buy profit is over 5%, more precisely", profitBuy);
            console.log("1 BTC bought for the price of", currentBid,"€");
            console.log("You have now", MyBtcs.length,"BTC's");

        }else{
        
            writeFile('Buy', 'Profit of ' + profitBuy + '.  No action performed');
            
            console.log("");
            console.log("INTENT TO BUY");
            console.log("Your buy profit is below 5%, more precisely", profitBuy);
            console.log("It's not worth to buy at this rate");
            console.log("You have now", MyBtcs.length,"BTC's");
        }

        lastSellingPrice = data.data.ask;

    } catch (error) {
        
    }
});
