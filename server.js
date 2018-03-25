'use static';

const express = require('express');
const db = require('./sqlModel');

const config = require('./config');

//const bodyParser = require('body-parser');

const app = express();

//logging
app.use('/', (req, res, next) => { console.log(new Date(), req.method, req.url); next(); });

//api stuffs
app.get('/api/units', sendUnits);
app.delete('/api/units/:id', deleteUnit);
app.post('/api/units', createUnit);
app.put('/api/units', updateUnit);

//static file
app.use('/', express.static(config.webpages, { extensions: ['html'] }));


// start server
app.listen(8080, (err) => {
  if (err) console.error('error starting server', err);
  else console.log('server started successfully');
});


//server functionality

async function sendUnits(req, res){

  try{
    const units = await db.listUnits(req.query.search, req.query.id);
    res.json(units);
  }catch(e){

    error(res,e);
  }
}

async function deleteUnit(req, res) {
  try {
    await db.deleteUnit(req.params.id);
    res.sendStatus(200);
  } catch (e) {
    if (e.status === 'gone') {
      res.sendStatus(410); // already gone
    } else {
      error(res, e);
    }
  }
}

async function updateUnit(req, res){
  try{
    const retval = await db.updateUnit(req.query.id, req.query.title);

    res.json(retval);
  }catch(e){
    error(res, e);
  }

}

async function createUnit(req, res){
  try {
    const retval = await db.addUnit(req.query.title, req.query.author);

    for(let i = 0; i < req.query.weeks; i++){
      const week = await db.createWeek(i+1,retval.id);
      console.log(week);
    }

    if (req.accepts('html')) {
      // browser will return back to the search page
      res.redirect(303, '/#' + retval.id);
    } else {
      // request that accepts JSON will instead get the data
      res.json(retval);
    }
  } catch (e) {
    error(res, e);
  }


}

function error(res, msg) {
  res.sendStatus(500);
  console.error(msg);
}
