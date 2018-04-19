import * as t from 'babel-types';
import template from 'babel-template';
import generate from 'babel-generator';
import adjNoun from 'adj-noun';


class jQuery_lookup
{

    constructor(naming = "AdjectiveNoun")
    {
        adjNoun.seed(Date.now());

        let uid_regexp = /(\w+)-UID/;
        this.naming = "UID";
        if (naming === "UID")
        {
            this.naming = naming;
        }
        else if (naming === "AdjectiveNoun")
        {
            this.naming = naming;
        }
        else if (uid_regexp.exec(naming))
        {
            this.naming = uid_regexp.exec(naming)[1];
        }


    }

    generateName(path)
    {
        if (this.naming === "UID")
        {
            return path.scope.generateUidIdentifierBasedOnNode(path.node);
        }
        else if (this.naming === "AdjectiveNoun")
        {
            let name = adjNoun().join("_");
            return path.scope.generateUidIdentifier(name);
        }
        else
        {
            return path.scope.generateUidIdentifier(this.naming);
        }
    }

    /*Compatibility: Chrome 1, Firefox 3.5, IE 8, Opera 10, Safari 3.2*/
    $(path, args, refVar)
    {
        if (args.length == 1)
        {
            if (t.isStringLiteral(args[0]))
            {
                if (!refVar)
                {
                    const statement = template(`var VARNAME = document.querySelectorAll(ARGS0);`);
                    const ast = statement({
                        VARNAME: this.generateName(path),
                        ARGS0: args[0]
                    });
                    return ast;
                }

                else
                {

                    const statement = template(`VARNAME = document.querySelectorAll(ARGS0);`);
                    const ast = statement({
                        VARNAME: refVar,
                        ARGS0: args[0]
                    });
                    return ast;


                }

            }
            else if (t.isIdentifier(args[0]))
            {
                if (!refVar)
                {
                    const statement = template(`var VARNAME = ARGS0;`);
                    const ast = statement({
                        VARNAME: this.generateName(path),
                        ARGS0: args[0]
                    });
                    return ast;
                }

                else
                {

                    const statement = template(`VARNAME = ARGS0;`);
                    const ast = statement({
                        VARNAME: refVar,
                        ARGS0: args[0]
                    });
                    return ast;


                }
            }
            else if (t.isThisExpression(args[0]))
            {
                if (!refVar)
                {
                    const statement = template(`var VARNAME = [ARGS0];`);
                    const ast = statement({
                        VARNAME: this.generateName(path),
                        ARGS0: args[0]
                    });
                    return ast;
                }

                else
                {

                    const statement = template(`VARNAME = [ARGS0];`);
                    const ast = statement({
                        VARNAME: refVar,
                        ARGS0: args[0]
                    });
                    return ast;


                }
            }
            else
            {
                throw path.buildCodeFrameError("Unexpected argument passed");
            }
        }
        else if (args.length == 2)
        {
            //TODO:context
        }

        else
        {
            throw path.buildCodeFrameError("Unexpected number of arguments passed");

        }

    }

    /*Compatibility: Chrome 1, IE 9, Edge 12, Firefox 2, Opera, Safari 3*/
    text(path, args, refVar)
    {
        if (!refVar)
        {
            //TODO:error code
            throw path.buildCodeFrameError("Unexpected parsing error");
        }
        if (args.length == 0)
        {
            const statement = template(`var TEMP = '';
            for(var i=0;i<REFVAR.length;i++){
                TEMP += REFVAR[i].textContent;
            }
            REFVAR = TEMP;
            `);
            const ast = statement({
                REFVAR: refVar,
                TEMP: this.generateName(path),
            });
            return ast;
        }
        else if (args.length == 1)
        {
            const statement = template(`for(var i=0;i<REFVAR.length;i++){
                                        REFVAR[i].textContent = ARGS0
                                        }`);
            const ast = statement({
                REFVAR: refVar,
                ARGS0: args[0]
            });
            return ast;
        }
        else
        {
            throw path.buildCodeFrameError("Unexpected number of arguments passed");
        }
    }

    //TODO: compatibility
    click(path, args, refVar)
    {
        if (!refVar)
        {
            //TODO:error code
            throw path.buildCodeFrameError("Unexpected parsing error");
        }
        if (args.length == 0)
        {
            //TODO:trigger click
            const statement = template(`for(var i=0;i<REFVAR.length;i++){
            REFVAR[i].click();
            }`);
            const ast = statement({
                REFVAR: refVar
            });
            return ast;
        }
        else if (args.length == 1)
        {

            return this.on(path,[t.stringLiteral('click'),args[0]],refVar);
            // if (t.isIdentifier(args[0]) || t.isFunctionExpression(args[0]))
            // {
            //     const statement = template(`for(var i=0;i<REFVAR.length;i++){
            //     REFVAR[i].addEventListener('click', FUNC);
            //     }`);
            //     const ast = statement({
            //         REFVAR: refVar,
            //         FUNC: args[0]
            //     });
            //     return ast;
            // }
            // else
            // {
            //     throw path.buildCodeFrameError("Unexpected argument passed");
            // }

        }
        else if (args.length == 2)
        {
            //TODO: event data
        }

        else
        {
            throw path.buildCodeFrameError("Unexpected number of arguments passed");
        }

    }

    //TODO: compatibility

    //WARNING: DOES NOT PLAY WELL WITH JQUERY EVENTS. DO NOT MIX AND MATCH.
    on(path, args, refVar)
    {
        if (!refVar)
        {
            //TODO:error code
            throw path.buildCodeFrameError("Unexpected parsing error");
        }
        if (args.length == 2)
        {
            if(t.isStringLiteral(args[0]) && (t.isFunctionExpression(args[1]) || t.isIdentifier(args[1])))
            {
                const statement = template(`for(var i=0;i<REFVAR.length;i++){
                                        REFVAR[i].addEventListener(ARGS0,ARGS1);
                                        }`);

                const ast = statement({
                    REFVAR: refVar,
                    ARGS0: args[0],
                    ARGS1: args[1]
                });
                return ast;
            }

            else
            {
                throw path.buildCodeFrameError('Unexpected argument passed');
            }
        }

        else if (args.length == 3)
        {
            //TODO: add child element type
            const statement = template(`var TEMP = ARGS2;
                                        for(var i=0;i<REFVAR.length;i++){
                                        REFVAR[i].addEventListener(ARGS0,function(event){
                                            var TEMP2 = document.querySelectorAll(ARGS1);
                                            for(var i=0;i< TEMP2.length;i++)
                                            {
                                                if(event.target === TEMP2[i])
                                                {
                                                    TEMP(event);
                                                }
                                            }
                                        });
                                        }`);
            const ast = statement({
                REFVAR: refVar,
                TEMP: this.generateName(path),
                TEMP2: this.generateName(path),
                ARGS0: args[0],
                ARGS1: args[1],
                ARGS2: args[2]
            });
            return ast;
        }
        else
        {
            //TODO:
            throw path.buildCodeFrameError("Unexpected number of arguments passed");
        }

    }

    /* Compatibility: Chrome, Edge, Firefox, IE, Opera, Safari */
    css(path, args, refVar)
    {
        if (!refVar)
        {
            //TODO:error code
            throw path.buildCodeFrameError("Unexpected parsing error");
        }
        if (args.length == 1)
        {
            if (t.isObjectExpression(args[0]))
            {
                //TODO: css dict variable
            }
            else if (t.isStringLiteral(args[0]))
            {
                const res = [];
                const statement1 = template(`if(REFVAR[0]){
                REFVAR = getComputedStyle(REFVAR[0])[ARGS];
                } else {
                REFVAR = undefined;
                }`);
                const ast = statement1({
                    REFVAR: refVar,
                    ARGS: args[0]
                });
                return ast;
            }
            else
            {
                throw path.buildCodeFrameError("Unexpected argument passed");
            }
        }
        else if (args.length == 2)
        {
            if (t.isStringLiteral(args[0]) && t.isStringLiteral(args[1]))
            {
                const statement = template(`for(var i=0;i<REFVAR.length;i++){
                REFVAR[i].style.setProperty(ARGS0,ARGS1);
                }`);
                const ast = statement({
                    REFVAR: refVar,
                    ARGS0: args[0],
                    ARGS1: args[1]
                });
                return ast;
            }

            else
            {
                throw path.buildCodeFrameError("Unexpected argument passed");
            }
        }
        else
        {
            throw path.buildCodeFrameError("Unexpected number of arguments passed");
        }
    }

    parent(path, args, refVar)
    {
        if (!refVar)
        {
            //TODO: Error Code
            throw path.buildCodeFrameError("Unexpected parsing error");
        }
        if (args.length == 0)
        {
            const statement = template(`var TEMP = [];
            var TEMP,i=0,j=0;
            while(TEMP = REFVAR[i++])
            {
                if()
            }
             `);
            const ast = template({
                REFVAR: refVar
            });
        }
    }
};

export function createLookup(naming)
{
    return new jQuery_lookup(naming);
}

