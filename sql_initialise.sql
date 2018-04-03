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

insert ignore into unitPlanner.unit values (1,'WebF1', 'Rich Boakes');

insert ignore into unitPlanner.week values (1,1,null,1);
insert ignore into unitPlanner.week values (2,2,null,1);
insert ignore into unitPlanner.week values (3,3,null,1);
insert ignore into unitPlanner.week values (4,4,null,1);
insert ignore into unitPlanner.week values (5,5,null,1);
insert ignore into unitPlanner.week values (6,6,null,1);
insert ignore into unitPlanner.week values (7,7,null,1);
insert ignore into unitPlanner.week values (8,8,null,1);
insert ignore into unitPlanner.week values (9,9,null,1);
insert ignore into unitPlanner.week values (10,10,null,1);
insert ignore into unitPlanner.week values (11,11,null,1);
insert ignore into unitPlanner.week values (12,12,null,1);
insert ignore into unitPlanner.week values (13,13,null,1);
insert ignore into unitPlanner.week values (14,14,null,1);
insert ignore into unitPlanner.week values (15,15,null,1);
insert ignore into unitPlanner.week values (16,16,null,1);
insert ignore into unitPlanner.week values (17,17,null,1);
insert ignore into unitPlanner.week values (18,18,null,1);
insert ignore into unitPlanner.week values (19,19,null,1);
insert ignore into unitPlanner.week values (20,20,null,1);
insert ignore into unitPlanner.week values (21,21,null,1);
insert ignore into unitPlanner.week values (22,22,null,1);
insert ignore into unitPlanner.week values (23,23,null,1);
insert ignore into unitPlanner.week values (24,24,null,1);

insert ignore into unitPlanner.content values (1,"Topic",1,1,null,null,"Introduction","Introduction to the unit
What to expect and when",null);
insert ignore into unitPlanner.content values (2,"Resource",1,1,null,null,null,null,"Induction week linkup
Content from PennyH");
insert ignore into unitPlanner.content values (3,"Lecture",1,1,"Rich & Jacek","Intro Lecture",null,null,null);

insert ignore into unitPlanner.content values (4,"Topic",1,1,null,null,"Security: Social Engineering","",null);

insert ignore into unitPlanner.content values (5,"Lecture",2,2,"Nick","Lecture on social engineering and security",null,null,null);
