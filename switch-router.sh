#! /bin/sh

# If the app router is in the source folder
if [ -d ./src/app ]
then

# Sets the variables for the main and alternate directory
main_dir="app"
alternate_dir="pages"

elif [ -d ./src/pages ]
then

# Sets the variables for the main and alternate directory
main_dir="pages"
alternate_dir="app"

# Exit the script if the directories are not found
else
exit

fi

# Swap the places of the two directories
mv "./src/$main_dir" "./alternate-router/$main_dir"
mv "./alternate-router/$alternate_dir" "./src/$alternate_dir"

# Tells the user which router is in effect
echo "The $alternate_dir router is in use."