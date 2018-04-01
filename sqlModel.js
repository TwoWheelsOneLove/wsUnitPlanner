'use strict';


const mysql = require('mysql');

const config = require('./config');

const sql = mysql.createConnection(config.mysql);


module.exports.listUnits = (search, unitId) => {
  return new Promise((resolve, reject) =>{

    let query = 'SELECT id, title, author FROM unit';

    if (unitId) {
      query += ' WHERE id = ' + sql.escape(unitId);
    }

    if (search) {
      query += ' WHERE title LIKE ' + sql.escape('%' + search + '%') + ' OR author LIKE ' + sql.escape('%' + search + '%') ;
    }

    query += ' ORDER BY id desc'

    sql.query(query, (err,data) =>{
      if (err) {
        reject(['failed to run the query', err]);
        return;
      }

      const retval = [];
       data.forEach((row)=>{
         retval.push({
           id: row.id,
           title: row.title,
           author: row.author,
         });
       });

       resolve(retval);
    });
  });
};

module.exports.listContent = (unitId, weekId) => {
  return new Promise((resolve, reject) => {
      let query;

      if (unitId){
        query = 'SELECT * from content WHERE unitId=' + sql.escape(unitId);
      }

      if (weekId){
        query = 'SELECT * from content WHERE weekId=' + sql.escape(weekId);
      }

      sql.query(query, (err,data) =>{
        if (err) {
          reject(['failed to run the query', err]);
          return;
        }

        const retval = [];
         data.forEach((row)=>{
           retval.push({
             id: row.id,
             contentType: row.contentType,
             unitId: row.unitId,
             weekId: row.weekId,
           });
         });

         resolve(retval);
      })
  });
}

module.exports.listWeeks = (id) => {
  return new Promise((resolve, reject) => {
    sql.query(sql.format('SELECT id, weekNum, weekTitle, unitId from week WHERE unitId=?', [id]),(err,data)=> {
      if (err) {
        reject(['Failed to query weeks', err]);
        return;
      }

      const retval = [];
       data.forEach((row)=>{
         retval.push({
           id: row.id,
           weekTitle: row.weekTitle,
           weekNum: row.weekNum,
           unitId: row.unitId,
         });
       });

       resolve(retval);
    })
  });
}

module.exports.deleteUnit = (id) => {
  return new Promise((resolve, reject) => {


      sql.query(sql.format('DELETE FROM week WHERE unitId=?', [id]), (err) => {
          if (err) {
            reject(['failed sql delete', err]);
            return;
          }
        });

        sql.query(sql.format('DELETE FROM unit WHERE id=?', [id]), (err) => {
            if (err) {
              reject(['failed sql delete', err]);
              return;
            }
          });

        resolve();
    });
  };


  module.exports.updateUnit = (unitId, title) =>{
    return new Promise((resolve,reject) =>{


      sql.query(sql.format('UPDATE unit SET title=? WHERE id=?',[title, unitId]), (err, result) =>{

        if (err) {
          reject(['failed sql insert', err]);
          return;
        }

      resolve({ id: unitId, title: title});



      })
    })
  }

module.exports.addUnit = (title, author) => {
  return new Promise((resolve,reject) =>{
    const dbRecord = {
      title,
      author,
    };

    sql.query(sql.format('INSERT INTO unit SET ?', dbRecord), (err, result) => {
        if (err) {
          reject(['failed sql insert', err]);
          return;
        }
        resolve({ id: result.insertId, title: dbRecord.title, author: dbRecord.author});


      });
  });
};

module.exports.createWeek = (weekNum, unitId) => {
  return new Promise((resolve,reject) =>{


    sql.query(sql.format('INSERT INTO week (weekNum, unitId) values (?, ?)', [weekNum, unitId]), (err, result) => {
        if (err) {
          reject(['failed sql insert', err]);
          return;
        }
        resolve({ weekId: result.insertId, weekNum: weekNum, unitId: unitId});


      });
  });
};
