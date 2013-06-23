---
layout: post
title: "ludum dare 26 - post mortem"
description: "My first ludum dare. Theme: Minimalism."
date: 2013-04-29
project: voxeljs
---
**Play the game here: [http://shama.github.io/ludum-dare-26/](http://shama.github.io/ludum-dare-26/)**

**[View my entry](http://www.ludumdare.com/compo/ludum-dare-26/?action=preview&uid=22120) on Ludum Dare**

**[Full source code](https://github.com/shama/ludum-dare-26) on Github**

<hr/>

I was introduced to [Ludum Dare](ludumdare.com/compo/) in a [tweet by hughskennedy](https://twitter.com/hughskennedy/status/327234957875486720) last Wednesday. It is a friendly game competition where developers are pitted to make a game based on a theme within 48 hours. The theme was: **Minimalism**. Perfect for [voxel.js](http://voxeljs.com).

I've been recently researching various pathfinding techniques. I came across a really well done [a star](https://github.com/superjoe30/node-astar) library which uses ASCII mazes as test cases. Inspired by those ASCII mazes, at the start of the competition I set off to create just a simple voxel maze.

<img src="/images/posts/ludum-dare-26-0.png" style="width:100%;" /><br/>
<br/>

I didn't intended on making a *scary game*. Originally I wanted a path of color follow behind the player to let them know where they've been. Then add various puzzles throughout each maze level. Getting a path generated based on where the player has been wasn't working out. All the methods I tried slowed down the game quite a bit. I threw that idea out.

Instead I went with markers. Simply click a wall to set a marker. Throughout this process I had red blocks I wasn't sure what I'd do with. But they sat there glaring at me. So I gave them eyes, then a mouth and the red monster was born.

<img src="/images/posts/ludum-dare-26-1.png" style="width:100%;" /><br/>
<br/>

## pathfinding
From then a lot of time was spent getting that red monster to navigate through the maze. The A\* library I was using is great but it was too slow. A\* will search a grid by scoring neighboring spaces in a recusive fashion. Which alone can be intensive as from far distances could try to hit every space in the grid. Jump Point Searching to the rescue. JPS uses A\* but will filter out undesireable grid spaces. When considering a grid space, it factors the parent or previous space we moved from. We can ignore any neighboring space the parent could efficiently access. As well as jump spaces when moving in straight or diagonal lines. The speeds up pathfinding by a huge factor.

Given the time constraints of the competition, I jumped ship and used [PathFinding.js](https://github.com/qiao/PathFinding.js) as it already had a jump point search implemented. It is an extremely fantastic library but unfortunately is hard coded to 2D. So I cheated. I kept my mazes 2D and restricted the red monsters to only move in 2D. Ultimately with voxel.js, superjoe30's [a-star](https://github.com/superjoe30/node-astar) will be superior once I get jump point searching implemented in 3D.

## out of time
Unfortunately my weekend was busy with real life events. I only had two evenings and a couple of hours on Saturday morning available. Next Ludum Dare I'm going to clear my weekend.

With time running out, I simplified. Run through the maze, fall to the next level maze and red monsters will chase you. It was pretty boring. I tried to make the red only chase you when you look at them but for most of the trials it was fairly easy to avoid them; just simply walk by looking up. I changed it to be based on distance to the player that way they always will chase.

## dont look
I left in the look dynamic. But instead of triggering the red it will increase the aggressiveness thus speeding it up.

*The secret to winning the game is to avoid looking at the red.*

## audio
I stumbled all over audio. I really wanted to have an Inception style fog horn get progressively louder as you got closer to the red. [voxel-audio](https://github.com/ryanramage/voxel-audio) got really close. Unfortunately since development on voxel.js has been so rapid; his library didn't work with the latest voxel-engine/three.js version I was using. I put some time into upgrading his lib but gave up due to time constraints.

I switched to just a basic `<audio>` tag. Unfortunately there is a bug in Chrome where `mp3` files will only play once per load and will not loop. Bummer. I settled on a single horn blow in the beginning.

## effects
Easily the best part of this game is the effects and funny enough they were the easiest. The same guy who introduced me to this competition has a neat library for adding post-processing effects: [voxel-pp](https://github.com/hughsk/voxel-pp). Hugh's library is dead simple to use:

``` javascript
var pp = require('voxel-pp')(game);
pp.use(require('./shader.js'));

// then later alter the shader values
pp.passes[1].uniforms.amount.value = 0.5;
```

I came across [this article](http://www.airtightinteractive.com/2013/02/intro-to-pixel-shaders-in-three-js/) on shaders and found the perfect post-processing effects: Bad TV and RGB Shift. Created by the author of that article: Felix Turner. [Here is a demo](http://www.airtightinteractive.com/demos/js/badtvshader/) of the shaders in action.

I simply copied and pasted the shader into `shaders/badtv.js` and changed `THREE.BadTVShader` to `module.exports`. Then used them with: `pp.use(require('./shaders/badtv.js'))`.

They worked beautifully and totally made the game.

<img src="/images/posts/ludum-dare-26-2.png" style="width:100%;" /><br/>
<br/>

## conclusion
I had a lot of fun. The 48 hour constraint was stressfull but it forced me to focus on making a complete game. Rather than the previous work on voxel.js implementing specific features of the engine. I will definitely be competing in the next Ludum Dare. 

Thanks to [Hugh Kennedy](https://github.com/hughsk) for introducing me to Ludum Dare and his sleak [voxel-pp](https://github.com/hughsk/voxel-pp) module. Go check out his Ludum Dare 26 game [grow.](http://hughsk.github.io/ludum-dare-26/) It is cool and embodies the minimalist theme very well.

Lastly go check out Max Ogden's Ludum Dare 26 entry: [Flood fill](http://www.ludumdare.com/compo/ludum-dare-26/?action=preview&uid=22924). It is frickin **multiplayer peer to peer voxel.js**! I am so excited about this. Just think voxel.js MMOs that are all in the browser. Really the only need for a server is to let the peers know about each other. This is the future. :D



