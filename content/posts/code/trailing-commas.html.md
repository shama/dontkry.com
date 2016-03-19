---
layout: post
title: "Trailing Commas"
description: "They are good"
date: 2013-06-06
---
I see this a lot:

> Your extra commas are a bad practice so I've removed them for you.

**Blindly following something you've heard forever is a bad practice.**

The reason you were once told trailing commas are bad is because they are invalid in EcmaScript 3. You'll get hard to find syntax errors when you accidentally place an extra comma somewhere.

Trailing commas are now valid in EcmaScript 5 and up. So unless you're writing javascript for really old browsers, don't worry about them.

To which the response usually is:

> But they are noisy and not needed.

So are semicolons.

Code style is the preference of the author. I like to maintain code in the style that I prefer. When contributing to another author's code, I try and maintain their style. Most maintainers would prefer you to contribute code in the style that they prefer as the code is their responsibility to maintain.

## Syntax Error
I prefer trailing commas because they help prevent the chance of a hard to find syntax error. It helps me avoid forgetting where I need commas when copying and pasting items in a list:

``` javascript
// Whoops this list isnt ordered the way I want
options: {
  one: true,
  two: true,
  four: true,
  three: true
}

// There fixed! Wait... syntax error...
options: {
  one: true,
  two: true,
  three: true
  four: true,
}
```

If I use trailing commas I avoid this error.

## Diff
Using trailing commas will make your project's `diff` cleaner. Consider if I had the following list:

``` javascript
nineties: {
  dude: true,
  awesome: true
}
```

Now later you realize that `rad` is missing from this list and sent me a pull request. The diff would be:

``` javascript
    nineties: {
      dude: true,
-     awesome: true
+     awesome: true,
+     rad: true
    }
```

Which is a bit distracting from the actual change `rad: true` that I need to review. If I used trailing commas the diff would be:

``` javascript
    nineties: {
      dude: true,
      awesome: true,
+     rad: true,
    }
```

and focus on the change that needs the review.

## Consistency
If you're still uncomfortable with them then let's at least be consistent about it. `Object.create`, `Object.keys`, `Array.isArray`, `Date.now`, `Array.prototype.filter`, `Array.prototype.map` and `Array.prototype.forEach` are just some of the other things I use often. These will also give a syntax error as they don't exist in EcmaScript 3. So be prepared to shim all of those as well if you're planning on "fixing" my trailing commas.

## Conclusion
I encourage using trailing commas. The only time you should avoid trailing commas is if your javascript needs to run on older browsers. If you're in that unfortunate spot, trailing commas will be the least of your concerns.

So use them or at least don't "fix" them for the people who prefer them.

They are likely not there on accident.
