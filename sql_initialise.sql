create database if not exists unitPlanner;

create table if not exists unitPlanner.unit (
  id int primary key auto_increment,
  title varchar(40),
  author varchar(40)
);

create table if not exists unitPlanner.week (
  id int primary key auto_increment,
  weekNum int not null,
  weekTitle varchar(40),
  unitId int not null,
  CONSTRAINT FK_UnitWeek FOREIGN KEY (unitId) REFERENCES unit(id)
);

create table if not exists unitPlanner.content (
 id int primary key auto_increment,
 contentType varchar(15),
 weekId int,
 unitId int not null,
 leader varchar(20),
 notes varchar(200),
 topicTitle varchar(30),
 topicDesc varchar(100),
 resourceLink varchar(400),
 CONSTRAINT FK_ContentWeek FOREIGN KEY (weekId) REFERENCES week(id),
 CONSTRAINT FK_ContentUnit FOREIGN KEY (unitId) REFERENCES unit(id)
);

insert ignore into unitPlanner.unit values (1,'Webscripting', 'Rich Boakes');
insert ignore into unitPlanner.unit values (2,'Web Foundations 2', 'Ann Plummer');

insert ignore into unitPlanner.week values (1,1,null,1);
insert ignore into unitPlanner.week values (2,2,null,1);
insert ignore into unitPlanner.week values (3,3,null,1);
insert ignore into unitPlanner.week values (4,4,null,1);
insert ignore into unitPlanner.week values (5,5,null,1);
insert ignore into unitPlanner.week values (6,6,null,1);

insert ignore into unitPlanner.week values (7,1,"Intro to webf2",2);
insert ignore into unitPlanner.week values (8,2,null,2);
insert ignore into unitPlanner.week values (9,3,null,2);

insert ignore into unitPlanner.content values (1,"Lecture",null,2,"Ann","A Lecture about some stuff",null,null,null);
insert ignore into unitPlanner.content values (2,"Practical",null,2,"Ann", "A Practical about some stuff",null,null,null);
insert ignore into unitPlanner.content values (3,"Resource",null,2,null,null,null,null,"www.facebook.com");
insert ignore into unitPlanner.content values (4,"Topic",null,2,null,null,"Intro To Webf2","Some more stuff about webf2",null);

insert ignore into unitPlanner.content values (5,"Resource",null,1,null,null,null,null,"www.google.com");

-- Select week.weekNum, week.id as weekID, unit.author from unit join week where week.unitId = unit.id;
