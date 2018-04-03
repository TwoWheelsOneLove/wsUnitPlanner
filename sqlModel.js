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
             leader: row.leader,
             notes: row.notes,
             topicTitle: row.topicTitle,
             topicDesc: row.topicDesc,
             resourceLink: row.resourceLink,
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

module.exports.deleteContent = (id) => {
return new Promise((resolve, reject) => {
  sql.query(sql.format('DELETE FROM content WHERE id=?', [id]), (err) => {
      if (err) {
        reject(['failed sql delete', err]);
        return;
      }
    });

    resolve();
  })
}

module.exports.deleteUnit = (id) => {
  return new Promise((resolve, reject) => {
    sql.query(sql.format('DELETE FROM content WHERE unitId=?', [id]), (err) => {
        if (err) {
          reject(['failed sql delete', err]);
          return;
        }
      });

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


  module.exports.updateContent = (contentId, weekId, note, leader, topicTitle,topicDesc,resourceLink)=>{
    return new Promise((resolve,reject) =>{

      if(resourceLink){
        sql.query(sql.format('UPDATE content SET resourceLink=? WHERE id=?',[resourceLink, contentId]), (err, result) =>{
          if (err) {
            reject(['failed sql update', err]);
            return;
          }
        })
            resolve();
      }


      if(topicDesc){
        sql.query(sql.format('UPDATE content SET topicDesc=? WHERE id=?',[topicDesc, contentId]), (err, result) =>{
          if (err) {
            reject(['failed sql update', err]);
            return;
          }
        })
            resolve();
      }

      if(topicTitle){
        sql.query(sql.format('UPDATE content SET topicTitle=? WHERE id=?',[topicTitle, contentId]), (err, result) =>{
          if (err) {
            reject(['failed sql update', err]);
            return;
          }
        })
            resolve();
      }

      if(note){
        sql.query(sql.format('UPDATE content SET notes=? WHERE id=?',[note, contentId]), (err, result) =>{

          if (err) {
            reject(['failed sql update', err]);
            return;
          }
        })
            resolve();
      }

      if(leader){
        sql.query(sql.format('UPDATE content SET leader=? WHERE id=?',[leader, contentId]), (err, result) =>{

          if (err) {
            reject(['failed sql update', err]);
            return;
          }
        })
            resolve();
      }

      if(weekId){
              if(weekId == "null"){
                sql.query(sql.format('UPDATE content SET weekId=null WHERE id=?',[contentId]), (err, result) =>{

                  if (err) {
                    reject(['failed sql update', err]);
                    return;
                  }
                })
              }else{
              sql.query(sql.format('UPDATE content SET weekId=? WHERE id=?',[weekId, contentId]), (err, result) =>{
                if (err) {
                  reject(['failed sql update', err]);
                  return;
                }
              })
        }
            resolve();
      }
    })
  }

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


module.exports.addContent = (unitId, type)=>{
return new Promise((resolve,reject) =>{
  sql.query(sql.format('INSERT INTO content (contentType, unitId) values (?, ?)', [type,unitId]), (err, result) => {
      if (err) {
        reject(['failed sql insert', err]);
        return;
      }
      resolve();
    });
  })
}

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
