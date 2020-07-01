const axios = require('axios');
const schedule = require('node-schedule');
const Postgres = require("./postgres");
const BotData = require("./botData");
const file = require("./file");
const functions = require("./functions");
const { writeFile } = require('fs');


let averageBtc = 9500;
let firstBtc = 0;
let idBtc = 0;
const MyBtcs = [];
let id = 0;
let lastSellingPrice = 0;
let sql = "";
var name = "";



const GetFirstBtc = async () => {
	try {

        const data = await axios.get('https://api.uphold.com/v0/ticker/BTCUSD')
        firstBtc = data.data.bid
        idBtc++
		MyBtcs.push({
			ID: idBtc,
			value: firstBtc,
        });

        lastSellingPrice = data.data.ask

        const transdesc = 'Bought first BTC by: ' + firstBtc
        var transdate =  new Date()
        transdate = transdate.toJSON().substr(0,10)

        sql = "INSERT INTO transactions(transtype, transdesc, transvalue, transprofit, transdate) VALUES (1, '" + transdesc + "', "+ firstBtc +", 0 , '"+ transdate + "')"
        Postgres.setData(sql)

        sql = "UPDATE BOT SET BOTWALLET = "+ MyBtcs.length +""
        Postgres.setData(sql)

        sql = "UPDATE BOT SET BOTBALANCE = -"+ firstBtc +""
        Postgres.setData(sql)

        console.log("");
        console.log("BID:", data.data.bid)
        console.log("ASK:", data.data.ask)
        console.log("You have now purchased your first BTC for", firstBtc,"€")

        file.writeFile("FIRST BTC", "You have now purchased your first BTC for " + firstBtc)
		return data.data.bid
	} catch(error) {
		console.log(error)
	}
};

function CreateBot(){
    try {

        sql = "SELECT * FROM BOT WHERE BOTNAME = 'Eduardo'"
        
        Postgres.getData(sql, function(err,data){
            if (err) {
                console.log("ERROR : ",err)          
            } else {            
                
                if(data.length >0){
                    name = data[0].botname
                    console.log("Hello again", name)

                }else{
                    
                    const BotData1 = new BotData("Eduardo", "Braga", "ealima.7@gmail.com","910055284","USD","0","0")

                    sql = "INSERT INTO bot(botname, botaddress, botemail, botcontact, botcurrency, botbalance, botwallet) VALUES ('Eduardo', 'Braga', 'ealima.7@gmail.com','910055284','USD',0,0)"
                    Postgres.setData(sql)

                    file.writeFile('BOT CREATED', BotData1.name)
                    name = BotData1.name
                    console.log("Hello", name)
                }
            }   
            
            
            console.log("")
            console.log("-----YOUR TRANSACTIONS-----")
    
    });
        

    } catch (error) {
        console.log(error)
    }

}

CreateBot()
GetFirstBtc()

schedule.scheduleJob('*/5 * * * * *', async () => {
	try {

        const data = await axios.get('https://api.uphold.com/v0/ticker/BTCUSD')

        const currentAsk = data.data.ask
        const currentBid = data.data.bid

        console.log("");
        console.log("BID:", data.data.bid)
        console.log("ASK:", data.data.ask)
              
        for (let index = 0; index < MyBtcs.length; index++) {
            
            let profitSell = functions.GetSellProfit(currentAsk, MyBtcs[index].value)

            if(profitSell > 5){
            
                file.writeFile('"INTENT TO SELL', 'Profit of ' + profitSell + '.  Moving 1 BTC to USD')
                sql = "INSERT INTO transactions(transtype, transdesc, transvalue, transprofit, transdate) VALUES (2, 'Moving 1 BTC to USD', "+ data.data.ask +", "+ profitSell +" , '"+ new Date().toJSON().substr(0,10) + "')"
                Postgres.setData(sql)
                MyBtcs.slice(index,1)

                console.log(""); 
                console.log("INTENT TO SELL")
                console.log("Your sell profit is over 5%, more precisely", profitSell)
                console.log("1 BTC sold for the price of", currentAsk,"€")
                console.log("You have now", MyBtcs.length,"BTC's")

                sql = "UPDATE BOT SET BOTWALLET = "+ MyBtcs.length +""
                Postgres.setData(sql)

                sql = "SELECT BOTBALANCE FROM BOT WHERE BOTNAME = 'Eduardo'"
        
                Postgres.getData(sql, function(err,data){
                    if (err) {
                        console.log("ERROR : ",err)           
                    } else {  
                        let currentBalance = data[0].botbalance + currentAsk

                        sql = "UPDATE BOT SET BOTBALANCE = "+ currentBalance +"";
                        Postgres.setData(sql)
                        
                    }});  

            
            }else{
                           
                file.writeFile('INTENT TO SELL', 'Profit of ' + profitSell + '.  No action performed')

                console.log("")
                console.log("INTENT TO SELL")
                console.log("Your sell profit is below 5%, more precisely", profitSell)
                console.log("It's not worth to sell at this rate")
                console.log("You have now", MyBtcs.length,"BTC's")
          
            }
        }

        let profitBuy = functions.GetBuyProfit(lastSellingPrice, data.data.bid)

        if(profitBuy > 5){
            
            MyBtcs.push({
                ID: idBtc,
                value: data.data.bid
            });

            idBtc++

            file.writeFile('Buy', 'Profit of ' + profitBuy + '.  Buying 1 BTC')

            sql = "INSERT INTO transactions(transtype, transdesc, transvalue, transprofit, transdate) VALUES (1, 'Buying 1 BTC', "+ data.data.bid +", "+ profitBuy +" , '"+ new Date().toJSON().substr(0,10) + "')"
            Postgres.setData(sql)
            
            console.log("")
            console.log("INTENT TO BUY")
            console.log("Your buy profit is over 5%, more precisely", profitBuy)
            console.log("1 BTC bought for the price of", currentBid,"€")
            console.log("You have now", MyBtcs.length,"BTC's")

            sql = "UPDATE BOT SET BOTWALLET = "+ MyBtcs.length +""
            Postgres.setData(sql)

        }else{
        
            file.writeFile('INTENT TO BUY', 'Profit of ' + profitBuy + '.  No action performed')
            
            console.log("")
            console.log("INTENT TO BUY")
            console.log("Your buy profit is below 5%, more precisely", profitBuy)
            console.log("It's not worth to buy at this rate")
            console.log("You have now", MyBtcs.length,"BTC's")
        }

        lastSellingPrice = data.data.ask

    } catch (error) {
        console.log(error)
    }
});


