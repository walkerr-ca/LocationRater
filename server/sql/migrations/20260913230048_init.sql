-- migrate:up
create table "user" (
  id int primary key generated always as identity,
  username varchar(20) unique not null,
  password varchar(255) not null,
  created_at timestamp not null default now(),
  deleted_at timestamp
);

create table session (
  id int primary key generated always as identity,
  user_id int not null,
  refresh_token varchar(255) not null,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now(),
  deleted_at timestamp not null
);

create table location (
  id int primary key generated always as identity,
  name varchar(255) not null,
  longitude float not null,
  latitude float not null,
  created_at timestamp not null default now(),
  deleted_at timestamp,
  unique (longitude, latitude)
);

create table review (
  id int primary key generated always as identity,
  user_id int not null,
  location_id int not null,
  title varchar(60),
  description varchar(255),
  rating int not null,
  created_at timestamp not null default now(),
  deleted_at timestamp,
  foreign key (user_id) references "user" (id),
  foreign key (location_id) references location (id),
  unique (user_id, location_id)
);

-- migrate:down
drop table review if exists;

drop table location if exists;

drop table "user" if exists;
