import {assert,expect} from 'chai';
import babelPluginTransformjQuery from '../src';
import * as babel from 'babel-core';
import jsdom from 'mocha-jsdom';
jsdom();

describe("0. Can do basic DOM manipulation",function(){
    var $;

    before(function () {
        $ = require('jquery');
    })

    it('0. Reads text from div', function (done) {
        document.body.innerHTML = '<div>hola</div>'
        var out = babel.transform("testVar = $('div').text()" , {
                    plugins:[babelPluginTransformjQuery]
                });
        var testVar;
        eval(out.code.replace(/\r?\n|\r/g,""));
        expect($('div').text()).eql(testVar);
        done();
    });

    it('1. Writes text to a div, and returns the div itself',function(done){
        document.body.innerHTML = '<div></div>'
        var out = babel.transform("testVar = $('div').text('abcd')" , {
            plugins:[babelPluginTransformjQuery]
        });
        var testVar;
        eval(out.code.replace(/\r?\n|\r/g,""));
        expect($('div').text()).eql("abcd");
        expect(testVar).eql($('div'));
        done();
    });
    it('2. Writes text to a div, without returning anything',function(done){
        document.body.innerHTML = '<div></div>';
        var out = babel.transform("$('div').text('abcd')", {
            plugins:[babelPluginTransformjQuery]
        });
        eval(out.code.replace(/\r?\n|\r/g,""));
        expect($('div').text()).eql("abcd");
        done();
    });
    it('3. Writes text to multiple divs',function(done){
        document.body.innerHTML = '<div></div><div></div>';
        var out = babel.transform("$('div').text('abcd')" , {
            plugins:[babelPluginTransformjQuery]
        });
        eval(out.code.replace(/\r?\n|\r/g,""));
        expect($('div').text()).eql("abcdabcd");
        done();
    });
    it('4. Reads text from multiple divs',function(done){
        document.body.innerHTML = '<div>abcd</div><div>abcd</div>';
        var out = babel.transform("testVar = $('div').text()", {
            plugins:[babelPluginTransformjQuery]
        });
        var testVar;
        eval(out.code.replace(/\r?\n|\r/g,""));
        expect(testVar).eql("abcdabcd");
        done();
    });
    it('5. Gets css property of div',function(done){
        document.body.innerHTML = '<div style="color:red"></div>';
        var out = babel.transform("testVar = $('div').css('color')", {
            plugins:[babelPluginTransformjQuery]
        });
        var testVar;
        eval(out.code.replace(/\r?\n|\r/g,""));
        expect(testVar).eql('red');
        done();
    });
    it('6. Sets css property of div, returns div',function(done){
        document.body.innerHTML = '<div style="color:red"></div>';
        var out = babel.transform("testVar = $('div').css('color','green')", {
            plugins:[babelPluginTransformjQuery]
        });
        var testVar;
        eval(out.code.replace(/\r?\n|\r/g,""));
        expect($('div').css('color')).eql('green');
        expect(testVar).eql($('div'));
        done();
    });
    it('7. Sets css property of div, no return value',function(done){
        document.body.innerHTML = '<div style="color:red"></div>';
        var out = babel.transform("$('div').css('color','green')", {
            plugins:[babelPluginTransformjQuery]
        });
        var testVar;
        eval(out.code.replace(/\r?\n|\r/g,""));
        expect($('div').css('color')).eql('green');
        done();
    });
});

