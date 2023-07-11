const csv = require('csv-parser');
const express = require('express');
const router = express.Router()
const multer = require('multer');
const { Readable } = require('stream');
const { dateWithoutTime } = require('../date');
const db = require('../db');
const bcrypt = require('bcrypt')

const upload = multer();

// for re agents
router.post('/agents', upload.single('csvFile'), async(req, res) => {

    const results = [];
    const csvString = req.file.buffer.toString(); 
  
    const stream = Readable.from(csvString)
        .pipe(csv({transform: (value, header) => (header === 'Phone Number' ? value.toString() : value) }))
        .on('headers', (headers) => {
            // Remove empty headers
            const validHeaders = headers.filter((header) => header.trim() !== '');
            stream.headers = validHeaders.map((header) => header.replace(/ /g, '_')); // Convert spaces to underscores
          })
          .on('data', (data) => {
            const formattedData = {};
      
            // Map the values to the valid headers with converted keys
            stream.headers.forEach((header) => {
              formattedData[header] = data[header];
            });
      
            results.push(formattedData);
          })
            .on('end', async() => {
                // Refining data
                for (let i = 0; i < results.length; i++) {
                    let Phone_Number;
                    let Office_Phone;
                    let Service_Radius;
                    for (let j = 0; j < results[i].Phone_Number.length; j++) {
                        Phone_Number = results[i].Phone_Number.replace(/[^0-9]/g, '')
                        Office_Phone = results[i].Office_Phone.replace(/[^0-9]/g, '')
                        Service_Radius = results[i].Service_Radius.replace(/[^0-9]/g, '')
                    }
                    results[i].Phone_Number = Phone_Number
                    results[i].Office_Phone = Office_Phone
                    results[i].Service_Radius = Service_Radius
                    results[i].name = `${results[i]['\ufeffFirst_Name']} ${results[i].Last_Name}`
                }

                const salt = bcrypt.genSaltSync(10)
                const encryptedPass = bcrypt.hashSync("sales@finitelead", salt)

                for (let i = 0; i < results.length; i++) {
                    if(results[i].Office_Phone.length > 11)
                        continue;
                    await db.query('INSERT INTO users(name, phone, email, address, password, role, created_at, brokerage_name, broker_name, office_phone, city, country, zip_code, state, service_radius, re_license_no) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)',[
                        results[i].name, results[i].Phone_Number, results[i].Email, results[i].Address, encryptedPass, 2, dateWithoutTime, results[i].Brokerage_Name, results[i].Broker_Name, results[i].Office_Phone, results[i].City, results[i].Country, results[i].Postal_Code, results[i].State, results[i].Service_Radius, results[i].Real_Estate_License_No
                    ])
                }
                // res.send(results)
                res.status(200).json({message: 'inserted'})
            })
            .on('error', (error) => {
                console.error(error.message);
                res.status(500).send('Internal Server Error');
            });
})

// for leads
router.post('/leads', upload.single('csvFile'), async(req, res) => {
    const results = [];
    const csvString = req.file.buffer.toString(); 
  
    const stream = Readable.from(csvString)
        .pipe(csv({transform: (value, header) => (header === 'Phone Number' ? value.toString() : value) }))
        .on('headers', (headers) => {
            // Remove empty headers
            const validHeaders = headers.filter((header) => header.trim() !== '');
            stream.headers = validHeaders.map((header) => header.replace(/ /g, '_')); // Convert spaces to underscores
          })
          .on('data', (data) => {
            const formattedData = {};
      
            // Map the values to the valid headers with converted keys
            stream.headers.forEach((header) => {
              formattedData[header] = data[header];
            });
      
            results.push(formattedData);
          })
          .on('end', async() => {
            for (let i = 0; i < results.length; i++) {
                let Phone_Number;
                for (let j = 0; j < results[i].Phone_Number.length; j++) {
                    Phone_Number = results[i].Phone_Number.replace(/[^0-9]/g, '')
                }
                results[i].Phone_Number = Phone_Number
                results[i]['Currently_working_with_an_agent:'] = results[i]['Currently_working_with_an_agent:'].toLowerCase() === 'no' ? 0 : 1;
                results[i]['I_want_to:'] = results[i]['I_want_to:'].toLowerCase() === 'sell' ? 0 : 1;
    
            }

            for (let i = 0; i < results.length; i++) {
                // console.log(results[i]);
                await db.query('INSERT INTO leads(lead_type, working_status, fname, lname, address, state, zip_code, phone, beds, baths, price, additional_info, created_on, agentName) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',[
                    results[i]['I_want_to:'], results[i]['Currently_working_with_an_agent:'], results[i].First_Name, results[i].Last_Name, results[i].Address, results[i].State, results[i].zip_code, results[i].Phone_Number, results[i].Beds, results[i].Baths, results[i].price ? results[i].price : 0, results[i].Additional, dateWithoutTime, results[i].Agent_Name
                ])
            }
            return res.status(200).json({message:'inserted'})
          })
          .on('error', (error) => {
            console.error(error.message);
            res.status(500).send(error.message);
        });
})

module.exports = router