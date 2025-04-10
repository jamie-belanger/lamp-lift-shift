# LAMP Lift and Shift
A helper project I created to make it easier to lift and shift legacy PHP sites into Docker containers. But note that this can create some problems due to the PHP and Apache versions in this project being up to date, while the code I put into the container typically is not. So far the improved developer experience of using this container has more than made up for that. Just be aware that shoving old PHP sites into this will not always be a smooth update.

See [1-Usage.md](./docs/1-Usage.md) for how to customize this repo.


## DX: Error Logs
Not only does this setup allow you to develop in real-time (edit any PHP/JS/CSS file in the site folder and reload), but you will also get PHP errors in real-time as well. They get dumped into the `error.log` file in the root folder. There is also an `access.log` file that shows the incoming connections, in case you want to be sure you're hitting the pages.

This alone makes working on older code less annoying. 👍️



# License = MIT
I'm building on the shoulders of giants here, so feel it's best not to claim any kind of copyright. You can do whatever you want with the contents of this repository. I appreciate attribution where it makes sense. I appreciate beer and coffee more 😜
