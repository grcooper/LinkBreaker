## Inspiration

We began this project with the Datto challenge in mind: what's the coolest thing we can do in under 4kb?
It had to be something self contained, efficient, and optimized. 

Graphics came to mind at first, specifically for a game of some sort, but doing that requires some pretty bulky libraries being tossed and `#include`d around.

But there was one place where we got that all for free - and that's the browser!

## What it does

LinkBreaker looks through the DOM of the current page you're on and picks up the first 50 `<a>` tags it sees. It then uses CSS animations to morph these into randomly coloured bricks at the top of the page. Paddle and ball are spawned right after that, and then a good old fashioned game of Brick Breaker begins!

Don't worry, those anchor tags aren't actually gone. Simply hit `esc` and your page is back to normal.

## How I built it

When building a project with space in mind, you really have to make sure that everything is as self contained as possible. We started out by building a script to do all the animations and the game logic separately, and slowly merged them together into the chrome extension architecture. Once we verified that everything was there and working, the uncompressed source was ~10kb...well over our limit. We optimized where possible, and minified every single file of all whitespace and extraneous characters, using [UglifyJS](https://github.com/mishoo/UglifyJS).

## Challenges I ran into

The main crux of our project was that, since it was manipulating the DOM, it used jQuery heavily. However, in order to include jQuery into a chrome extension, it's source needs to be added as a user script. This means that I'll have to lug around a 400kb+ file wherever I went.

And of course that wouldn't do.

But since chrome extensions are prevented from injecting scripts (and other tags) from the CSP, I had to get a bit creative. What I ended up doing was making an ajax GET call to the cdn hosting the minified jquery code. The response was simply a single string, and that string was all of the jQuery code, wrapped up in a closure.

So I did what any sane person would do... and ran `eval()` on that string.

_It worked._

## Accomplishments that I'm proud of

Once I finally minified all the source and uploaded the extension for testing, it was time to pack it up. Chrome created the `.crx` executable, and I nervously navigated to my project directory to check it's file size.

_3,665 bytes_

Now that's a pretty close call. And the fact that I got so close really made me happy. It made me happy because not only was I within the bounds of the challenge, but I successfully picked something complex enough to approach the upper bound without hitting it. I thought that was really cool, and probably what I'm proud about the most overall.

## What I learned

Javascript is crazy, yo.

But besides that, I think being conscious of size really had a lasting impression on me. Looking back at past projects, I've always just installed and included things wherever I wanted to - not even taking into account how much space I was using. And although the scale of my other projects compared to this one isn't that large, the concept of keeping file size down is valid everywhere.

## What's next for LinkBreaker

Little bit of cleaning up, and onto the Chrome Web Store she goes!
