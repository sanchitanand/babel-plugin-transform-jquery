import {assert} from 'chai';
import babelPluginTransformjQuery from '../src';
import * as babel from 'babel-core';

describe("Basics", function ()
{
    it("Can import plugin", function ()
    {
        assert(typeof babelPluginTransformjQuery === "function");
    });

});

