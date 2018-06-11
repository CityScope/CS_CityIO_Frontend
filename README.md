# cityIO
####Front-End for CityIO: MIT CityScope Distributed System

This page provides a front-end interface for cityIO backend server. This can be used to display an overview of current active CityScope deployments around the world and a real-time dashboard of the cityIO API data for each table. 



![alt text](/img/cityIOfe.png "cityIO frontend")


 ____

## how to build using `parcel` for GH pages 

`parcel build index.html --public-url https://cityscope.github.io/CS_CityIO_Frontend/`

## Deploying a subfolder [dist] to GitHub Pages

Sometimes you want to have a subdirectory on the `master` branch be the root directory of a repository’s `gh-pages` branch. Here's how to do it:

For the sake of this example, let’s pretend the subfolder containing your site is named `dist`.

### Step 1

Remove the `dist` directory from the project’s `.gitignore` (or skip and force-add afterwards).

### Step 2

Make sure git knows about your subtree (the subfolder with your site).

```sh
git add dist
```

or force-add it if you don't want to change your `.gitignore`

```sh
git add dist -f
```
Remember to commit!

```sh
git commit -m "gh-pages first commit!"
```

### Step 3

Use subtree push to send it to the `gh-pages` branch on GitHub.

```sh
git subtree push --prefix dist origin gh-pages
```

Boom. If your folder isn’t called `dist`, then you’ll need to change that in each of the commands above.

---

If you do this on a regular basis, you could also [create a script](https://github.com/cobyism/dotfiles/blob/master/bin/git-gh-deploy) containing the following somewhere in your path:

```sh
#!/bin/sh
if [ -z "$1" ]
then
  echo "Which folder do you want to deploy to GitHub Pages?"
  exit 1
fi
git subtree push --prefix $1 origin gh-pages
```

Which lets you type commands like:

```sh
git gh-deploy path/to/your/site
```

____
[Developed & Maintained by Ariel Noyman](https://github.com/RELNO)