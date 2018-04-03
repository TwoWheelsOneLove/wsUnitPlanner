'use static';

const express = require('express');
const db = require('./sqlModel');

const config = require('./config');

//const bodyParser = require('body-parser');

const app = express();

//logging
app.use('/', (req, res, next) => { console.log(new Date(), req.method, req.url); next(); });

//static file
app.use('/', express.static(config.webpages, { extensions: ['html'] }));

//API REQUEST HANDLING
//Return all units
app.get('/api/units', sendUnits);

//return weeks by Unit id
app.get('/api/weeks', sendWeeks);

//return content by week or unit id
app.get('/api/weekContent', sendContent);

//delete unit by id
app.delete('/api/units/:id', deleteUnit);

//delete content by id
app.delete('/api/content/:id', deleteContent);

//upload a new unit
app.post('/api/units', createUnit);

//upload new content
app.post('/api/content', addContent);

//update unit details
app.put('/api/units', updateUnit);

//update content location/fields
app.put('/api/content', updateContent);

// START SERVER
app.listen(config.port, (err) => {
  if (err) console.error('error starting server', err);
  else console.log('server started successfully');
});


//API FUNCTIONS
async function sendWeeks(req,res){
    const weeks = await db.listWeeks(req.query.id);
    res.json(weeks);
}

async function sendContent(req, res){
    const content = await db.listContent(req.query.unitId, req.query.weekId);
    console.log(content);
    res.json(content);
}

async function sendUnits(req, res){
    const units = await db.listUnits(req.query.search, req.query.id);
    res.json(units);
}

async function deleteUnit(req, res) {
    await db.deleteUnit(req.params.id);
    res.sendStatus(200);
}

async function deleteContent(req, res){
    await db.deleteContent(req.params.id);
    res.sendStatus(200);
}

async function updateContent(req, res){
    const retval = await db.updateContent(req.query.contentId, req.query.newWeekId, req.query.note, req.query.leader, req.query.topicTitle, req.query.topicDesc, req.query.resource);
    res.json(retval);
}

async function updateUnit(req, res){
    const retval = await db.updateUnit(req.query.id, req.query.title);
    res.json(retval);
}

async function addContent(req, res){
    const retval = await db.addContent(req.query.id, req.query.type);
    res.json(retval);
}

async function createUnit(req, res){
    const retval = await db.addUnit(req.query.title, req.query.author);

    for(let i = 0; i < req.query.weeks; i++){
      const week = await db.createWeek(i+1,retval.id);
      console.log(week);
    }

    // browser will return back to the homepage
    res.redirect(303, '/#');
}
