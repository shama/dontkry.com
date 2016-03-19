---
ignored: true
layout: post
title: "UVs As I Understand"
description: "They are not coordinates!"
project: voxeljs
icon: picture
---
When I first set off to learn about UV mapping, most everyone describes them as coordinates. Which is misleading. They are not coordinates but rather *use* coordinates. A better description in my opinion is a **paint by numbers** system.

For example we have a cube and would like to paint a face with our texture:

``` none
      +----+
     /      / |
    +----+ |
    |      | +
    |      | /
    +----+
```

To paint our texture onto the face, we **paint by numbers**. The numbers we use are between `0 - 1`.

`0` is completely to the *left* or *top* and `1` is to the *right* or *bottom*. Which means `0.5` is half way across horizontally or vertically.

``` none
0,0 -- 1,0
 |        |
 |        |
0,1 -- 1,1
```

*Using* these coordinates we move our crayon: `1 > 2 > 3 > 4` to paint the picture:

``` none
 1 ---- 2
 |        |
 |        |
 4 ---- 3
```

Our UV coordinates are: `[ [0,0], [1,0], [1,1], [0,1] ]`. Which will map our entire texture onto the face without any rotation.

## What if we wanted to rotate the texture 90&deg;?
Simply paint starting one number back:

``` none
 2 ---- 3
 |        |
 |        |
 1 ---- 4
```

Making our coordinates: `[ [0,1], [0,0], [1,0], [1,1] ]`.

## What if we only wanted to paint half of our texture?
`[ [0,0], [.5,0], [.5,1], [0,1] ]` will paint the left half of our texture across the face.

``` none
0,0 -- .5,0 -- 1,0
 |        |        |
 |        |        |
 |        |        |
 |        |        |
 |        |        |
0,1 -- .5,1 -- 1,1
```

## What about flipping the texture?
Oh now you're getting tricky. Count in reverse!

``` none
 4 ---- 3
 |        |
 |        |
 1 ---- 2
```

Making our coordinates: `[ [0,1], [1,1], [1,0], [0,0] ]`.

So that is how I understand UV mapping. Paint by numbers which just so happen to be coordinates.
