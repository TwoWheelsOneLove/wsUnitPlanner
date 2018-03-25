create database if not exists unitPlanner;

create table if not exists unitPlanner.unit (
  id int primary key auto_increment,
  title varchar(40),
  author varchar(40)
);

create table if not exists unitPlanner.week (
  id int primary key auto_increment,
  weekNum int not null,
  unitId int not null,
  CONSTRAINT FK_UnitWeek FOREIGN KEY (unitId) REFERENCES unit(id)
);



insert ignore into unitPlanner.unit values (1,'Webscripting', 'Rich Boakes');
insert ignore into unitPlanner.unit values (2,'Web Foundations 2', 'Ann Plummer');

insert ignore into unitPlanner.week values (1,1,1);
insert ignore into unitPlanner.week values (2,2,1);
insert ignore into unitPlanner.week values (3,3,1);
insert ignore into unitPlanner.week values (4,4,1);
insert ignore into unitPlanner.week values (5,5,1);
insert ignore into unitPlanner.week values (6,6,1);

insert ignore into unitPlanner.week values (7,1,2);
insert ignore into unitPlanner.week values (8,2,2);
insert ignore into unitPlanner.week values (9,3,2);

-- Select week.weekNum, week.id as weekID, unit.author from unit join week where week.unitId = unit.id;
