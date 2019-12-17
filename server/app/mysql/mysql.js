const mysql = require('mysql');
var msClient = mysql.createConnection({
    host: 'localhost',
    user:   'root',
    password:   'tkh170294',
    database:   'smartKiot',
    multipleStatements: 'true'
});
msClient.promiseQuery = sql => {
    return new Promise((resolve, reject) => {
        msClient.query(sql, (err, result) => {
            if(err){
                return reject(err);
            }
            resolve(result);
        })
    })
};
msClient.connect(err => {
    if(err){
        throw err;
    }else{
        console.log('database connected...');
    };
});

module.exports = msClient;