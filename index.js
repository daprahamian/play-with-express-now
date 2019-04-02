'use strict';

const mongodb = require('mongodb');
const password = 'pencil';
const URL = `mongodb+srv://darpa:${password}@cluster0-6qhoz.mongodb.net/test?retryWrites=true`;

const client = new mongodb.MongoClient(URL, { useNewUrlParser: true });
const clientP = client.connect();

const express = require('express')
const helmet = require('helmet')

const app = express()

// add some security-related headers to the response
app.use(helmet())

app.get('*', (req, res) => {
    clientP.then(function() {
        const collection = client.db('test').collection('test');
        
        return collection.find().toArray().then(function(results) {
          results = results.map(x => ({ a: x.a }));
          res.send({
            results,
            version: process.versions
          });
        });
      }).catch(e => {
        res.send('Error:' + e + '(' + JSON.stringify(process.env) + ')');
      });
    // res.set('Content-Type', 'text/html')
    // res.send(200, `
    //     <h1><marquee direction=right>Hello from Express path '/' on Now 2.0!</marquee></h1>
    //     <h2>Go to <a href="/about">/about</a></h2>
    // `)
})

module.exports = app
