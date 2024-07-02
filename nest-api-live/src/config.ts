// config.js
import * as AWS from 'aws-sdk';
 
AWS.config.update({
    accessKeyId: 'your-access-key-id',
    secretAccessKey: 'your-secret-access-key',
    region: 'your-aws-region',
});

module.exports = AWS;
