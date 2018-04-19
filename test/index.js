import {assert, expect} from 'chai';
import babelPluginTransformjQuery from '../src';
import * as babel from 'babel-core';
import jsdom from 'mocha-jsdom';

jsdom();

describe("1. Can do basic DOM manipulation", function ()
{
    var $;

    before(function ()
    {
        $ = require('jquery');
    })
    describe("1.1. $()",function(){
       it("1.1.1 Select single div",function(done){
           document.body.innerHTML = '<div>hola</div>';
           var out = babel.transform("var testVar = $('div');", {
               plugins: [babelPluginTransformjQuery]
           });
           expect(eval(out.code.replace(/\r?\n|\r/g, "") + "testVar;")).eql($("div"));
           done();

       });

       it("1.1.2 Select multiple divs",function(done){
           document.body.innerHTML = '<div>hola</div><div>hello</div>';
           var out = babel.transform("var testVar = $('div');", {
               plugins: [babelPluginTransformjQuery]
           });
           expect(eval(out.code.replace(/\r?\n|\r/g, "") + "testVar;")).eql($("div"));
           done();
       });
    });

    describe("1.2. text()", function ()
    {
        it('1.2.1. Reads text from div', function (done)
        {
            document.body.innerHTML = '<div>hola</div>';
            var out = babel.transform("testVar = $('div').text()", {
                plugins: [babelPluginTransformjQuery]
            });
            var testVar;
            eval(out.code.replace(/\r?\n|\r/g, ""));
            expect($('div').text()).eql(testVar);
            done();
        });

        it('1.2.2. Writes text to a div, and returns the div itself', function (done)
        {
            document.body.innerHTML = '<div></div>'
            var out = babel.transform("testVar = $('div').text('abcd')", {
                plugins: [babelPluginTransformjQuery]
            });
            var testVar;
            eval(out.code.replace(/\r?\n|\r/g, ""));
            expect($('div').text()).eql("abcd");
            expect(testVar).eql($('div'));
            done();
        });
        it('1.2.3. Writes text to a div, without returning anything', function (done)
        {
            document.body.innerHTML = '<div></div>';
            var out = babel.transform("$('div').text('abcd')", {
                plugins: [babelPluginTransformjQuery]
            });
            eval(out.code.replace(/\r?\n|\r/g, ""));
            expect($('div').text()).eql("abcd");
            done();
        });
        it('1.2.4. Writes text to multiple divs', function (done)
        {
            document.body.innerHTML = '<div></div><div></div>';
            var out = babel.transform("$('div').text('abcd')", {
                plugins: [babelPluginTransformjQuery]
            });
            eval(out.code.replace(/\r?\n|\r/g, ""));
            expect($('div').text()).eql("abcdabcd");
            done();
        });
        it('1.2.5. Reads text from multiple divs', function (done)
        {
            document.body.innerHTML = '<div>abcd</div><div>abcd</div>';
            var out = babel.transform("testVar = $('div').text()", {
                plugins: [babelPluginTransformjQuery]
            });
            var testVar;
            eval(out.code.replace(/\r?\n|\r/g, ""));
            expect(testVar).eql("abcdabcd");
            done();
        });
        it("1.2.6. Variable Assignment", function (done)
        {
            document.body.innerHTML = '<div>hola</div>';
            var out = babel.transform("var testVar = $('div').text()", {
                plugins: [babelPluginTransformjQuery]
            });
            expect(eval(out.code.replace(/\r?\n|\r/g, "") + "testVar;")).eql('hola');
            done();
        });
    });
    describe("1.3. css()", function ()
    {
        it('1.3.1. Gets css property of div', function (done)
        {
            document.body.innerHTML = '<div style="color:red"></div>';
            var out = babel.transform("testVar = $('div').css('color')", {
                plugins: [babelPluginTransformjQuery]
            });
            var testVar;
            eval(out.code.replace(/\r?\n|\r/g, ""));
            expect(testVar).eql('red');
            done();
        });
        it('1.3.2. Sets css property of div, returns div', function (done)
        {
            document.body.innerHTML = '<div style="color:red"></div>';
            var out = babel.transform("testVar = $('div').css('color','green')", {
                plugins: [babelPluginTransformjQuery]
            });
            var testVar;
            eval(out.code.replace(/\r?\n|\r/g, ""));
            expect($('div').css('color')).eql('green');
            expect(testVar).eql($('div'));
            done();
        });
        it('1.3.3. Sets css property of div, no return value', function (done)
        {
            document.body.innerHTML = '<div style="color:red"></div>';
            var out = babel.transform("$('div').css('color','green')", {
                plugins: [babelPluginTransformjQuery]
            });
            var testVar;
            eval(out.code.replace(/\r?\n|\r/g, ""));
            expect($('div').css('color')).eql('green');
            done();
        });

        it("1.3.4. Variable Assignment", function (done)
        {
            document.body.innerHTML = '<div style="color:red"></div>';
            var out = babel.transform("var testVar = $('div').css('color')", {
                plugins: [babelPluginTransformjQuery]
            });
            expect(eval(out.code.replace(/\r?\n|\r/g, "") + "testVar;")).eql('red');
            done();
        });

        //This test doesnt work in jsdom for some reason
        // it('1.3.5. Set multiple properties', function (done)
        // {
        //     document.body.innerHTML = '<div></div>';
        //     var out = babel.transform("$('div').css({backgroundColor: 'black', color: 'white'});",{
        //         plugins: [babelPluginTransformjQuery]
        //     });
        //     eval(out.code.replace(/\r?\n|\r/g, ""));
        //     expect($('div').css('color')).eql('white');
        //     expect($('div').css('background-color')).eql('black');
        // });
    });

    describe("1.4. click()",function(){
        it('1.4.1. sets a click callback on a single DOM element, returns the DOM element', function (done)
        {
            document.body.innerHTML = '<button>Click me!</button>';
            var out = babel.transform("var testVar = $('button').click(function(){  " +
                "$(this).text('Clicked');" +
                "});" , {
               plugins:[babelPluginTransformjQuery]
            });
            expect(eval(out.code.replace(/\r?\n|\r/g, "") + "testVar;")).eql($('button'));
            $('button').click();
            expect($('button').text()).eql("Clicked");
            done();
        });

        it('1.4.2. sets a click callback on multiple DOM elements, returns array of DOM elements', function (done)
        {
            document.body.innerHTML = '<button id="1">Click me!</button><button id="2">Click me too!</button>';
            var out = babel.transform("var testVar = $('button').click(function(){  " +
                "$(this).text('Clicked');" +
                "});" , {
                plugins:[babelPluginTransformjQuery]
            });
            expect(eval(out.code.replace(/\r?\n|\r/g, "") + "testVar;")).eql($('button'));
            $('button').click();
            expect($('#1').text()).eql("Clicked");
            expect($('#2').text()).eql("Clicked");
            done();
        });

        it('1.4.3. triggers click callback on single element', function (done)
        {
            document.body.innerHTML = '<button>Click me!</button>';
            $("button").click(function(){
                $(this).text("Clicked");
            });
            var out = babel.transform("$('button').click();" , {
                plugins:[babelPluginTransformjQuery]
            });
            eval(out.code.replace(/\r?\n|\r/g, ""));
            expect($('button').text()).eql("Clicked");
            done();
        });

        it('1.4.4. triggers click callback on multiple elements', function (done)
        {
            document.body.innerHTML = '<button id="1">Click me!</button><button id="2">Click me too!</button>';
            $("button").click(function(){
                $(this).text("Clicked");
            });
            var out = babel.transform("$('button').click();" , {
                plugins:[babelPluginTransformjQuery]
            });
            eval(out.code.replace(/\r?\n|\r/g, ""));
            expect($('#1').text()).eql("Clicked");
            expect($('#2').text()).eql("Clicked");
            done();
        });
    });

    describe('1.5. on()', function ()
    {
        it('1.5.1 sets a callback on an event for a single element, returns the element', function (done)
        {
            document.body.innerHTML = '<input type = "text"><div></div>';
            var out = babel.transform("var testVar = $('input').on('click',function(){  " +
                "$('div').text('Changed');" +
                "});" , {
                plugins:[babelPluginTransformjQuery]
            });
            expect(eval(out.code.replace(/\r?\n|\r/g, "") + "testVar;")).eql($('input'));
            // $('input').on('change',function(){
            //     $('div').text("Changed");
            // });
            $("input").click();
            expect($("div").text()).eql("Changed");
            done();
        });
    });
});


