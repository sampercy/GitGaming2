

/* PHP v JS

Elvis:   PHP ?:  JS  ||
Nullish: PHP ??  JS  ??

Nullish assign: JS: x ??=
Assign to x only if x is null: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_assignment

Custom Fns JS: e0 e1 e2 eo b bold red blue green colour linethrough italics espan ediv em yn

Mod: JS: %

console.log(13 % 5);  // Expected output: 3



*/


/* ********* HTML Constants
&nbsp;
&emsp;
*/


// ********************************************************************** JAVASCRIPT ARRAYS

let s = ""
let a = [3, 3, 3, 3]

// Loop option 1
a.forEach(function (value, index, wholeArray) {
  s += (index * index + value) + ","
});
alert(s) //3,4,7,12,

// Loop option 2

a.forEach((entry, idx) => {
});

['aaa', 'bbb', 'ccc'].forEach((entry, idx) => {
  
});

//method 2
for (let instruction of instructions) {
}

// includes
var n = fruits.includes("Mango");

//Check for Array
Array.isArray()

// The push() method adds one or more elements to the end of an array and returns the new length of the array. ...
// The unshift() method adds one or more elements to the beginning of an array and returns the new length of the array:

//Count
n.length

//Search array of objects
let ix = prev.findIndex(x => x.pk == 1234)
if (ix >= 0) { }
// or .find

//Filter xx
let homes = fix.filter(m => m.loc == "home")

// Sort numeric

ary.sort(function(a, b){return a - b})

// ********************************************************************** JAVASCRIPT OBJECTS

//check for object
if (typeof (obj) === "object") { }

//Object has property
obj.hasOwnProperty("abc")

//quick output
alert(JSON.stringify(obj, null, 2))

//Loop
Object.entries(obj).forEach(([key, value]) => { })

//Search
var details = Object.values(app.gen.datasets.allplayers.data).find(p => p.player == "Lobb, Rory")


//count
var count = Object.keys(myObject).length; 



/*  ******** PHP

explode(string $separator, string $string, int $limit = PHP_INT_MAX): array
explode("abc,defg,hijk,lm", ",")


implode(string $separator, array $array): string
implode(",", array("abc", "defg", "hijk", "lm")): string

foreach (iterable_expression as $key => $value)
    statement
    
*/


// ********************************************************************** JAVASCRIPT LOOPS


let i = 0;
do { i += 1; } while (i < 5);

while (condition) statement  //(this format is identical in PHP)



//  PHP Array functions

// array_walk     Apply a user supplied function to every member of an array, pretty much just a loop




/*

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
97
98
99
100



*/