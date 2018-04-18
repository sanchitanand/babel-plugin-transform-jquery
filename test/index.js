import {assert,expect} from 'chai';
import babelPluginTransformjQuery from '../src';
import * as babel from 'babel-core';
import jsdom from 'mocha-jsdom';
import {test_case_a,test_case_b} from './test_cases/basic_examples';
import fs from 'fs';
jsdom();

describe("0. Can do basic DOM manipulation",function(){
    var $;

    before(function () {
        $ = require('jquery');
    })

    it('0. Reads text from div', function (done) {
        document.body.innerHTML = '<div>hola</div>'
        var out = babel.transform(test_case_a , {
                    plugins:[babelPluginTransformjQuery]
                });
        var testVar;
        eval(out.code.replace(/\r?\n|\r/g,""));
        expect($('div').text()).eql(testVar);
        done();
    });

    it('1. Writes text to a div',function(done){
        document.body.innerHTML = '<div></div>'
        var out = babel.transform(test_case_b , {
            plugins:[babelPluginTransformjQuery]
        });
        var testVar;
        eval(out.code.replace(/\r?\n|\r/g,""));
        expect($('div').text()).eql("abcd");
        done();
    });
});

