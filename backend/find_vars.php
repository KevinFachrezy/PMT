<?php
$c = file_get_contents("storage/app/templates/unzipped/word/document.xml"); 
echo substr(strip_tags($c), 0, 1000);
