import * as util from './util.js';
import {types as t} from 'babel-core';
export default function()
{


    function destructChain(path,arr,lookup, refVar)
    {
        if (!arr)
           var arr = [];
        if(t.isCallExpression(path.node))
        {
            if(t.isIdentifier(path.node.callee,{name:"$"}))
            {
                if(!refVar)
                {
                    let ast = lookup.$(path,path.node.arguments);
                    arr.push(ast);
                    refVar = ast.declarations[0].id;
                    return refVar;
                }
                else
                {
                    let ast = lookup.$(path,path.node.arguments,refVar);
                    arr.push(ast);
                    return refVar;
                }


            }
            else if (t.isMemberExpression(path.node.callee))
            {

                let id = destructChain(path.get("callee").get("object"), arr, lookup, refVar);
                if (id)
                {
                    if (typeof (lookup[path.node.callee.property.name]) === "function")
                    {
                        let temp = lookup[path.node.callee.property.name](path, path.node.arguments, id);
                        if (!temp)
                        {
                            //TODO: error code
                            console.log("UTIL NOT WORKING!");
                        }

                        if (temp.length)
                        {
                            for (let i = 0; i < temp.length; i++)
                            {
                                arr.push(temp[i]);
                            }
                        }
                        else
                        {
                            arr.push(temp);
                        }
                        return id;
                    }
                    else
                    {
                        //TODO:error handling
                        throw path.buildCodeFrameError("Unrecognized function name");
                        return null;
                    }
                }
                else
                {
                    return null;
                }

            }
            else
            {
                return null;
            }
        }
        else
        {

            return null;
        }
    }



    return {
      name : "ast-transform",
      visitor: {

          ExpressionStatement : function(path,state)
          {
              if(!this._lookup)
              {
                  this._lookup = util.createLookup(state.opts.naming);
              }
              if(t.isCallExpression(path.node.expression))
              {
                  let new_statements = [];
                  let refVar = destructChain(path.get("expression"), new_statements,this._lookup);
                  if (!refVar)
                  {
                      return;
                  }

                  path.replaceWithMultiple(new_statements);
                  path.skip();
              }
              else if (t.isAssignmentExpression(path.node.expression) && path.node.expression.operator === "=" && t.isCallExpression(path.node.expression.right))
              {
                  let new_statements = [];
                  let refVar = destructChain(path.get("expression").get("right"),new_statements, this._lookup, path.node.expression.left);
                  if(!refVar)
                  {
                      return;
                  }
                  path.replaceWithMultiple(new_statements);
                  path.skip();


              }
          },
          VariableDeclarator: function(path,state)
          {
              if(!this._lookup)
              {
                  this._lookup = util.createLookup(state.opts.naming);
              }
              if(t.isCallExpression(path.node.init))
              {
                  let new_statements = [];
                  let refVar = destructChain(path.get('init'),new_statements,this._lookup ,path.node.id);
                  if(!refVar)
                  {
                      return;
                  }
                  const stmt = t.variableDeclarator(path.node.id);
                  path.parentPath.insertAfter(new_statements);
                  path.replaceWith(stmt);
                  path.skip();

              }
          },
          CallExpression: function(path,state)
          {
              if(!this._lookup)
              {
                  this._lookup = util.createLookup(state.opts.naming);
              }
              let new_statements = [];
              let refVar = destructChain(path, new_statements, this._lookup);
              if(!refVar)
                  return;
              path.getStatementParent().insertBefore(new_statements);
              path.replaceWith(refVar);

          }
      }
    };
};