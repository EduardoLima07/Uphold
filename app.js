const axios = require('axios');
const schedule = require('node-schedule');
const Postgres = require("./postgres");
const BotData = require("./botData");
const file = require("./file");
const functions = require("./functions");
const { writeFile } = require('fs');

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

        const transdesc = 'You have now purchased your first BTC'
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

        file.writeFile(0, "BID: " + data.data.bid)
        file.writeFile(1, "ASK: " + data.data.ask)
        file.writeFile(1, "You have now purchased your first BTC for " + firstBtc)

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
                    file.writeFile(0,"Hello again " + name+ "")

                }else{
                    
                    const BotData1 = new BotData("Eduardo", "Braga", "ealima.7@gmail.com","910055284","USD","0","0")

                    sql = "INSERT INTO bot(botname, botaddress, botemail, botcontact, botcurrency, botbalance, botwallet) VALUES ('Eduardo', 'Braga', 'ealima.7@gmail.com','910055284','USD',0,0)"
                    Postgres.setData(sql)

                    file.writeFile(0,'BOT CREATED')
                    file.writeFile(1,"Wellcome " + BotData1.name+ "")

                    name = BotData1.name
                    console.log("Wellcome", name)
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
                
                sql = "INSERT INTO transactions(transtype, transdesc, transvalue, transprofit, transdate) VALUES ('2', 'Moving 1 BTC to USD', "+ data.data.ask +", "+ profitSell +" , '"+ new Date().toJSON().substr(0,10) + "')"
                Postgres.setData(sql)
                MyBtcs.slice(index,1)

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

                console.log(""); 
                console.log("INTENT TO SELL")
                console.log("Your sell profit is over 5%, more precisely", profitSell)
                console.log("1 BTC sold for the price of", currentAsk,"€")
                console.log("You have now", MyBtcs.length,"BTC's")    

                file.writeFile(0,"INTENT TO SELL")
                file.writeFile(1,"Your sell profit is over 5%, more precisely "+ profitSell +"")                 
                file.writeFile(1,"1 BTC sold for the price of "+ currentAsk + "€")
                file.writeFile(1,"You have now "+  MyBtcs.length + "BTC's")    
           
            }else{
                           
                console.log("")
                console.log("INTENT TO SELL")
                console.log("Your sell profit is below 5%, more precisely", profitSell)
                console.log("It's not worth to sell at this rate")
                console.log("You have now", MyBtcs.length,"BTC's")

                file.writeFile(0,"INTENT TO SELL")
                file.writeFile(1,"Your sell profit is below 5%, more precisely "+ profitSell +"")                 
                file.writeFile(1,"It's not worth to sell at this rate")
                file.writeFile(1,"You have now "+  MyBtcs.length + "BTC's")    
          
            }
        }

        let profitBuy = functions.GetBuyProfit(lastSellingPrice, data.data.bid)

        if(profitBuy > 5){
            
            MyBtcs.push({
                ID: idBtc,
                value: data.data.bid
            });

            idBtc++

            sql = "INSERT INTO transactions(transtype, transdesc, transvalue, transprofit, transdate) VALUES (1, 'Buying 1 BTC', "+ data.data.bid +", "+ profitBuy +" , '"+ new Date().toJSON().substr(0,10) + "')"
            Postgres.setData(sql)
            
            sql = "UPDATE BOT SET BOTWALLET = "+ MyBtcs.length +""
            Postgres.setData(sql)

            sql = "SELECT BOTBALANCE FROM BOT WHERE BOTNAME = 'Eduardo'"
        
            Postgres.getData(sql, function(err,data){
                if (err) {
                    console.log("ERROR : ",err)           
                } else {  

                    let currentBalance = data[0].botbalance - currentBid

                    sql = "UPDATE BOT SET BOTBALANCE = "+ currentBalance +"";
                    Postgres.setData(sql)
                    
                }});  

            console.log("")
            console.log("INTENT TO BUY")
            console.log("Your buy profit is over 5%, more precisely", profitBuy)
            console.log("1 BTC bought for the price of", currentBid,"€")
            console.log("You have now", MyBtcs.length,"BTC's")
            
            file.writeFile(0,"INTENT TO BUY")
            file.writeFile(1,"Your BUY profit is below 5%, more precisely "+ profitBuy +"")                 
            file.writeFile(1,"1 BTC sold for the price of "+ currentBid + "€")
            file.writeFile(1,"You have now "+  MyBtcs.length + "BTC's")    

        }else{
                    
            console.log("")
            console.log("INTENT TO BUY")
            console.log("Your buy profit is below 5%, more precisely", profitBuy)
            console.log("It's not worth to buy at this rate")
            console.log("You have now", MyBtcs.length,"BTC's")

            file.writeFile(0,"INTENT TO BUY")
            file.writeFile(1,"Your sell profit is below 5%, more precisely "+ profitBuy +"")                 
            file.writeFile(1,"It's not worth to sell at this rate")
            file.writeFile(1,"You have now "+  MyBtcs.length + "BTC's")    
        }

        lastSellingPrice = data.data.ask

    } catch (error) {
        console.log(error)
    }
});


