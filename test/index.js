import assert from 'assert';
import babelPluginTransformjQuery from '../src';
import * as babel from 'babel-core';

describe("Basics", function ()
{
    it("Can import library", function ()
    {
        assert(typeof babelPluginTransformjQuery === "function");
    });

});

