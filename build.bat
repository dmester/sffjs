@echo off
echo.
echo Enter version:
set /P version=
echo.

mkdir releases

mkdir obj
mkdir obj\cultures
del /Q obj\*.*
del /Q ~stringformat.nuspec

rem obj files
del /Q out.~js

copy /Y src\stringformat.js obj\stringformat-%version%.js
copy /Y src\stringformat.tests.js obj\
copy /Y src\license.txt obj\
copy /Y src\readme.txt obj\
copy /Y src\changelog.txt obj\
copy /Y src\tests.html obj\
xcopy /D /Y src\cultures\*.* obj\cultures\

utils\compiler.jar --js=src\stringformat.js --js_output_file=out.~js

rem Append header
copy /B src\header.txt + out.~js obj\stringformat-%version%.min.js

rem Timestamp
utils\DateTimeFormat --utc --format "yyyy-MM-ddTHH:mm:ssZ" > date.~tmp
set /P date= < date.~tmp
utils\DateTimeFormat --utc --format "yyyy" > date.~tmp
set /P year= < date.~tmp
del date.~tmp

copy src\stringformat.nuspec ~stringformat.nuspec

rem Replace version
utils\replace "{version}=%version%" "{date}=%date%" "{year}=%year%" obj\stringformat-%version%.js obj\stringformat-%version%.min.js obj\stringformat.tests.js obj\readme.txt obj\license.txt obj\tests.html ~stringformat.nuspec

rem Create NuGet Package
utils\NuGet.exe pack ~stringformat.nuspec -OutputDirectory releases
del /Q ~stringformat.nuspec

rem obj files
del /Q out.~js

rem Create zip
del /Q releases\sffjs.%version%.zip
cd obj
..\utils\7z a -tzip ..\releases\sffjs.%version%.zip *
cd ..

pause