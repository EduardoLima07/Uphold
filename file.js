const fs = require('fs');

const logger = fs.createWriteStream('Transactions.txt', {
	flags: 'a' // 'a' means appending (old data will be preserved)
     });

const writeFile = async (type,transaction) => {
        try {
    
            logger.write(Date(Date.now()).toString());
            logger.write('\r\n');  
            logger.write(type);
            logger.write('\r\n');  
            logger.write(transaction);
            logger.write('\r\n');  
    
        } catch (error) {
            
            console.log(error);
        }
    };

module.exports.writeFile = writeFile;