@echo off
echo.
echo Enter version:
set /P version=
echo.

mkdir Release
mkdir Release\cultures
del /Q Release\*.*

rem Temp files
del /Q out.~js

copy /Y stringformat.js Release\stringformat.src.js
copy /Y stringformat.tests.js Release\
copy /Y license.txt Release\
copy /Y readme.txt Release\
copy /Y changelog.txt Release\
copy /Y tests.html Release\
xcopy /D /Y cultures\*.* Release\cultures\

utils\compiler.jar --js=stringformat.js --js_output_file=out.~js

rem Append header
copy /B header.txt + out.~js Release\stringformat.js

rem Timestamp
utils\DateTimeFormat --utc --format "yyyy-MM-ddTHH:mm:ssZ" > date.~tmp
set /P date= < date.~tmp
utils\DateTimeFormat --utc --format "yyyy" > date.~tmp
set /P year= < date.~tmp
del date.~tmp

rem Replace version
utils\replace "{version}=%version%" "{date}=%date%" "{year}=%year%" Release\stringformat.js Release\stringformat.src.js

rem Temp files
del /Q out.~js

