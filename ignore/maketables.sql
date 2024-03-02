
CREATE TABLE tags (
  tagkey int(11) NOT NULL,
  itemcode varchar(50) NOT NULL,
  itemsource varchar(50) NOT NULL,
  sequence int not null,
  tagname varchar(50) NOT NULL,
  tagvalue varchar(50) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

ALTER TABLE tags ADD PRIMARY KEY (tagkey);
ALTER TABLE tags MODIFY tagkey int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;


CREATE TABLE itemsources (
  itemsource varchar(50) NOT NULL,
  sortlevel int not null
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

ALTER TABLE itemsources ADD PRIMARY KEY (itemsource);

INSERT INTO itemsources VALUES ('general', 99);
INSERT INTO itemsources VALUES ('5e', 10);
INSERT INTO itemsources VALUES ('SP', 20);
INSERT INTO itemsources VALUES ('TH', 30);
