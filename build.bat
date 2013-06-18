@echo off
echo.
echo Enter version:
set /P version=
echo.

mkdir releases

mkdir obj
mkdir obj\cultures
del /Q obj\*.*

rem obj files
del /Q out.~js

copy /Y stringformat.js obj\stringformat.src.js
copy /Y stringformat.tests.js obj\
copy /Y license.txt obj\
copy /Y readme.txt obj\
copy /Y changelog.txt obj\
copy /Y tests.html obj\
xcopy /D /Y cultures\*.* obj\cultures\

utils\compiler.jar --js=stringformat.js --js_output_file=out.~js

rem Append header
copy /B header.txt + out.~js obj\stringformat.js

rem Timestamp
utils\DateTimeFormat --utc --format "yyyy-MM-ddTHH:mm:ssZ" > date.~tmp
set /P date= < date.~tmp
utils\DateTimeFormat --utc --format "yyyy" > date.~tmp
set /P year= < date.~tmp
del date.~tmp

rem Replace version
utils\replace "{version}=%version%" "{date}=%date%" "{year}=%year%" obj\stringformat.js obj\stringformat.src.js obj\readme.txt obj\license.txt

rem obj files
del /Q out.~js

rem Create zip
del /Q releases\sffjs.%version%.zip
cd obj
..\utils\7z a -tzip ..\releases\sffjs.%version%.zip *

pause