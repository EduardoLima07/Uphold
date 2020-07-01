const fs = require('fs');

const logger = fs.createWriteStream('Transactions.txt', {
	flags: 'a' // 'a' means appending (old data will be preserved)
     });

const writeFile = async (type,transaction) => {
        try {

            if(type == 0){
                logger.write('\r\n'); 
                logger.write('\r\n'); 
                logger.write(Date(Date.now()).toString());
                logger.write('\r\n');  
                logger.write(transaction);
            }else{
                logger.write('\r\n');  
                logger.write(transaction);
            }

        } catch (error) {
            
            console.log(error);
        }
    };

module.exports.writeFile = writeFile;