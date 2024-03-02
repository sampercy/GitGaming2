

DELETE FROM tags WHERE itemcode = 'templates';
INSERT INTO tags (itemcode, itemsource, sequence, tagname, tagvalue) VALUES ('templates', 'general', 0, ':tempname', '<<#surround|bold|<<Name>>>>');
INSERT INTO tags (itemcode, itemsource, sequence, tagname, tagvalue) VALUES ('templates', 'general', 0, ':boldstart', '<span style=''font-weight:bold''>');
INSERT INTO tags (itemcode, itemsource, sequence, tagname, tagvalue) VALUES ('templates', 'general', 0, ':boldend', '</span>');
UPDATE caches SET version = version + 1 WHERE cachename = 'tags' AND fkey = 0;

<<tempname>>

<<:boldstart>><<Name>><<:boldend>>
