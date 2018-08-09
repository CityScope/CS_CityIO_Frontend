# #!/bin/bash
# directory="./dist"

# # bash check if dist directory already exists
# if [ -d $directory ]; then
# 	echo "Dist exists, removing"
sudo rm -rf dist

# build the dist for public url 
sudo parcel build index.html --public-url https://github.com/CityScope/CS_CityIO_Frontend/
# make sure to add dist 
git add dist -f
#commit the GH pages changes 
git commit -m "gh-pages commit"
#push to subtree remote 
# git subtree push --prefix dist origin gh-pages
git push origin `git subtree split --prefix dist master`:gh-pages --force
