## how to build using `parcel` for GH pages

`parcel build index.html --public-url https://cityscope.github.io/CS_CityIO_Frontend/`

[might need this to fix missing plugin note: npm install babel-plugin-transform-runtime]

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
git commit -m "gh-pages commit"
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

---

# How to fix:

https://gist.github.com/cobyism/4730490#gistcomment-2337463

### `"Updates were rejected because a pushed branch tip is behind its remote"`

### full error msg:

```
$ git subtree push --prefix dist origin gh-pages
git push using:  origin gh-pages
To https://github.com/RELNO/cityIO_Forntend.git
 ! [rejected]        a19d9bc6e8046b507cde9154ec94daad3e7aeefa -> gh-pages (non-fast-forward)
error: failed to push some refs to 'https://github.com/RELNO/cityIO_Forntend.git'
hint: Updates were rejected because a pushed branch tip is behind its remote
hint: counterpart. Check out this branch and integrate the remote changes
hint: (e.g. 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

### Setup

```$ rm -rf dist
$ echo "dist/" >> .gitignore

$ git worktree add dist gh-pages
```

### Making changes

```
$ make # or what ever you run to populate dist
$ cd dist
$ git add --all
$ git commit -m "Deploy to gh-pages"
$ git push origin gh-pages
$ cd ..
```

### Notes

git worktree feature has its own garbage collection so if dist is deleted it will not affect much and can be recreated as needed. If you want it to go away you can use `git worktree prune` See man pages on it.
