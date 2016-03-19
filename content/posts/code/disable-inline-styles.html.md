---
layout: post
title: "Disable Inline Styles"
date: 2015-04-01
---

This post is an explanation of the following tweet I made:

<blockquote class="twitter-tweet" lang="en"><p>CSS as modules is really interesting until you learn the security issues related to inline styles. TL;DR do the extra requests for your css.</p>&mdash; shama (@shamakry) <a href="https://twitter.com/shamakry/status/581156159584866304">March 26, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Let me preface this with **I am not a security expert.** Just a paranoid front
end developer. If you want advice from actual security experts, please hire the
good people over at [^lift](https://liftsecurity.io/).

I understand disabling inline styles is controversial. They are super convenient.
With the emergence of single page app CSS tooling, it seems inline styles are
also becoming more frequently used.

In no way am I intending on spreading FUD; just simply trying to bring awareness
to an often ignored concern with front end development.

## What are inline styles?

Inline `<style>` tags:
``` html
<style>
body { background-color: red; }
</style>
```

Inline `<style>` tag created via JavaScript:
``` javascript
var style = document.createElement('style')
style.innerHTML = 'body { background-color: red; }'
document.head.appendChild(style)
```

Inline `style` attributes:
``` html
<a href="#" style="color:red;">Click</a>
```

Setting the `style` attribute via JavaScript:
``` javascript
document.body.setAttribute('style', 'background-color:red;')
```

### Single Page App Libraries
Single page app focused frameworks/libraries like React, Ember, Angular,
Mercury, etc make it easier to create inline styles. As such, there seems to be
a rising trend using inline styles and many "modular CSS" solutions are emerging.

Be aware, most of these solutions rely on inline styles via a inline `<style>`
tag and/or inline `style` attribute. Each have different methods of escaping
(or not escaping) data as it's written inline using one of the above methods.

I'm not advocating any of these libraries are insecure nor providing any
example exploits here.

However I am suggesting, that maybe overusing inline styles right next to all
that dynamic user data, might not be the best idea.

## Attacking with CSS
The primary vulnerability of CSS comes when an attacker is allowed to inject data
into content that will be displayed to other users.

### LEAVING THE FRONT DOOR WIDE OPEN
Let's say we have an discussion board app. Users can start new threads and
respond to existing ones. Users create messages by inputing text into a
`<textarea/>`. The contents are stored in a database and then shown to other
users when they visit the page.

That data on our page is shown **unescaped.** Meaning a malicious user could
enter their own tags as their "comment". Those tags get executed for every other
user that views that comment on your page.

Let's ignore the inline `<script>` tag injection risk. You know, similar to
the attack that is currently DDOSing github as I write this. Let's focus on CSS.

A malicious user could do quite a few things with just CSS:

### Deface your website
An attacker can use your website to spread their message:

``` css
body::before { content: "Thanks Obama"; }
```

### Create a phishing attack
An attacker could modify existing elements to trick a user into exposing
sensitive information:

``` css
textarea.post-comment::before {
  content: "Please enter your password to post a comment...";
}
```

### Use your popular website as a node to try and DDOS another website

``` css
.container::before { content: url(http://example.com/processIntensiveEndpoint); }
.another::before { content: url(http://example.com/processIntensiveEndpoint?1); }
body::before { content: url(http://example.com/processIntensiveEndpoint?2); }
/* ... and so on ... */
```

### Troll the product team attack
If you were a malicious user and really disliked a company, an unsecured inline
style would be an interesting way subtly deteriorate the company's product.

Maybe add an animation delay to make the site appear slower? Misalign elements
so the site looks sloppy? Make particular items disappear to cause confusion?

Not all attacks will be technical in nature.

### Old Browsers
In old IE <8 you could use CSS expressions to run JavaScript in CSS. Known as
"Dynamic Properties."

```css
#modal {
  position: absolute;
  top: expression(document.body.clientHeight / 2);
}
```

Easy to understand that running JavaScript in CSS is not a good idea. Although
barely anyone still uses IE<8. Hopefully an attacker just injects:

``` javascript
alert('wow you\'re making this too easy for me, please upgrade your browser.')
```

It's not just old IE though, Firefox has [-moz-binding](https://developer.mozilla.org/en-US/docs/Web/CSS/-moz-binding)
in which in older versions could be used to obtain cookie data.

Some older browsers don't deal with CDATA consistently so silly things like the
following are possible:

``` html
<style>
<!-- </style><script>alert('whoops')</script> -->
</style>
```

There are a number of other security issues with older browsers. Admittedly not
as big of a concern as older browsers get used less and less these days. But the
history shows, browser vendors will make security mistakes.

### and on, and on...

Here is an XSS Filter Evasion Cheat Sheet from OWASP:
[https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet](https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet)

With a proper Content Security Policy in place, these attacks would not be
possible.

## What is a Content Security Policy?
A Content Security Policy (CSP) is a HTTP header that tells the browser which
things you consider safe and which you do not.

By default, your browser will blindly trust that everything is safe (besides
[same origin policy](http://en.wikipedia.org/wiki/Same-origin_policy)
violations, of course).

To enable a CSP, you set the HTTP header `Content-Security-Policy`. Specifically
to disable inline styles, the header is:

```
Content-Security-Policy: style-src 'self'
```

Which will block and throw an error in your browser console with each inline
style attempt on your page.

There are many other policies you can configure. I highly recommend that you
enact at least some CSP to prevent XSS attacks.

[Here is a fantastic article](http://www.html5rocks.com/en/tutorials/security/content-security-policy/)
that explains CSP in a lot more detail.

## Attackers are more clever than you
An easy excuse is,

> "just ensure all user data is escaped and inline styles are safe."

Considering myself and most of us are not security experts; there are likely far
more clever XSS attacks then ones I've shown here.

So ask yourself:

* How solid is your escaping method?
* Are you sure you're escaping all the possible injection places?
* How, over the life span of your app, will you ensure those injection places
remain locked down?

It is also important to remember browsers are written by humans. Humans make
mistakes. If you limit what a malicious user can do with a browser you are
reducing the risk of those yet known mistakes being exploited.

If you disable inline styles in your CSP, you don't need to worry about the
above questions.

## Examples Remedied
For *most* circumstances I can think of, inline styles are just for developer
convenience.

For example let's say we have a table and want to selectively hide columns. Our
user toggles column visibility and we conveniently dynamically generate the CSS.

But you don't really need to do that. Unless you have an infinite number of
columns you can likely pre-generate the column visibility conditions and then
just modify the class of your table to toggle column visibility:

``` css
.table.table-hide-col1 .table-col1 {
  display: none;
}
.table.table-hide-col2 .table-col2 {
  display: none;
}
.table.table-hide-col3 .table-col3 {
  display: none;
}
.table.table-hide-col4 .table-col4 {
  display: none;
}
```

Then just hide the columns with classes:
``` html
<table class="table table-hide-col1 table-hide-col3">
<tr>
  <td class="table-col1"></td>
  <td class="table-col2"></td>
  <td class="table-col3"></td>
  <td class="table-col4"></td>
</tr>
</table>
```

> Or get clever with nth-child, etc

Another example is user configurable column width. A user can set their columns
to a width between `0` and `Infinity`. We can't pre-generate CSS to cover all
those conditions.

So we need to dynamically set our CSS in this use case. Interestingly, setting
`element.style.width` doesn't violate our unsafe inline CSP.

So instead of dynamically building a `style` attribute which has the potential
for content injection:

``` javascript
var col1 = document.querySelector('.table-col1')
col1.setAttribute('style', 'width:' + userColumnWidth + 'px;')
```

Just explicitly set the CSS property with:

``` javascript
var col1 = document.querySelector('.table-col1')
col1.style.width = userColumnWidth + 'px'
```

## Conclusion
Yes, I know I am being totally paranoid. In a lot of these circumstances, it
would be terribly hard for malicious user data to be injected by an attacker.

**But it only takes 1 mistake.**

So if you're not planning on disabling inline styles outright, at the very least
minimize your usage of inline styles to use cases where it's absolutely
necessary.

I too think CSS as modules is very intriguing but given the above security
concerns; perhaps inline styles isn't the solution.

---

References:

* http://www.html5rocks.com/en/tutorials/security/content-security-policy/
* http://code.google.com/p/browsersec/wiki/Part1#Cascading_stylesheets
* http://scarybeastsecurity.blogspot.com/2009/12/generic-cross-browser-cross-domain.html
* https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet
