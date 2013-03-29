mkdir Release
del /Q Release\*.*
copy /Y stringformat.js Release\stringformat.src.js
copy /Y license.txt Release\
copy /Y readme.txt Release\

rpc -encoding UTF-8 -q stringformat.js -header header.txt -o Release\stringformat.js -p "Daniel Mester Pirttij„rvi" --DEBUG=false

