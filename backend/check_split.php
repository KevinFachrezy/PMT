<?php
$c = file_get_contents('storage/app/templates/unzipped/word/document.xml');
if(strpos($c, '&lt;NAMA PERUSAHAAN&gt;') !== false) {
    echo 'EXISTS AS WHOLE STRING';
} else {
    echo 'SPLIT OR NOT FOUND';
}
