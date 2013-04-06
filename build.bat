mkdir Release
mkdir Release\cultures
del /Q Release\*.*
copy /Y stringformat.js Release\stringformat.src.js
copy /Y stringformat.tests.js Release\
copy /Y license.txt Release\
copy /Y readme.txt Release\
copy /Y changelog.txt Release\
copy /Y tests.html Release\
xcopy /D /Y cultures\*.* Release\cultures\

rpc -encoding UTF-8 -q stringformat.js -header header.txt -o Release\stringformat.js -p "Daniel Mester Pirttij„rvi" --DEBUG=false

